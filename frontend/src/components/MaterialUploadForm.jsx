import { useEffect, useRef, useState } from 'react'
import { API_BASE_URL, parseJson, getAuthHeaders, getAuthHeadersMultipart } from '../lib/api'
import './MaterialUploadForm.css'

const MaterialUploadForm = ({ materialType }) => {
  const fileInputRef = useRef(null)
  const [subjectId, setSubjectId] = useState('')
  const [subjects, setSubjects] = useState([])
    useEffect(() => {
      let active = true

      const loadSubjects = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/subjects`, {
            headers: getAuthHeaders(),
          })
          const data = await parseJson(response)

          if (!response.ok) {
            return
          }

          if (active) {
            setSubjects(data?.subjects || [])
          }
        } catch {
          if (active) {
            setSubjects([])
          }
        }
      }

      loadSubjects()

      return () => {
        active = false
      }
    }, [])

  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })
  const [showProgress, setShowProgress] = useState(false)

  const handleFileSelect = (selected) => {
    if (!selected) return
    setFile(selected)
    setStatus({ loading: false, error: '', success: '' })
    setShowProgress(false)
    setProgress(0)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files?.[0]
    handleFileSelect(droppedFile)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const storedUser = localStorage.getItem('essd_user')
    const currentUser = storedUser ? JSON.parse(storedUser) : null

    if (!currentUser?.id) {
      setStatus({ loading: false, error: 'Usuário não autenticado.', success: '' })
      return
    }

    if (!subjectId) {
      setStatus({ loading: false, error: 'Selecione a matéria.', success: '' })
      return
    }

    if (!file) {
      setStatus({ loading: false, error: 'Selecione um arquivo para enviar.', success: '' })
      return
    }

    setStatus({ loading: true, error: '', success: '' })
    setProgress(0)
    setShowProgress(true)

    const formData = new FormData()
    formData.append('user_id', String(currentUser.id))
    formData.append('subject_id', subjectId)
    formData.append('type', materialType || 'apostila')
    formData.append('file', file)

    try {
      const response = await new Promise((resolve, reject) => {
        const request = new XMLHttpRequest()
        request.open('POST', `${API_BASE_URL}/materials/upload`, true)
        
        const headers = getAuthHeadersMultipart()
        Object.entries(headers).forEach(([key, value]) => {
          request.setRequestHeader(key, value)
        })

        request.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100)
            setProgress(percent)
          }
        }

        request.onload = () => resolve(request)
        request.onerror = () => reject(new Error('Erro ao enviar o arquivo.'))
        request.send(formData)
      })

      if (response.status < 200 || response.status >= 300) {
        const data = await parseJson({
          text: () => Promise.resolve(response.responseText || ''),
        })
        throw new Error(data?.message || 'Não foi possível enviar o material.')
      }

      setStatus({ loading: false, error: '', success: 'Material enviado com sucesso.' })
      setFile(null)
      setSubjectId('')
      setProgress(0)
      setShowProgress(false)
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
      setShowProgress(false)
    }
  }

  return (
    <form className="material-upload" onSubmit={handleSubmit}>
      <div className="material-upload-header">
        <h3>Enviar material</h3>
        <p>Tipo selecionado: <strong>{materialType || 'Selecione acima'}</strong></p>
      </div>

      <label className="material-field">
        <span>Matéria</span>
        <select
          value={subjectId}
          onChange={(event) => {
            setSubjectId(event.target.value)
            setStatus({ loading: false, error: '', success: '' })
            setShowProgress(false)
            setProgress(0)
          }}
        >
          <option value="">Selecione a matéria</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>{subject.name}</option>
          ))}
        </select>
      </label>

      <div
        className={`dropzone ${file ? 'has-file' : ''}`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => event.key === 'Enter' && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="dropzone-input"
          onChange={(event) => handleFileSelect(event.target.files?.[0])}
        />
        <div>
          <strong>{file ? file.name : 'Arraste e solte o arquivo aqui'}</strong>
          <p>{file ? 'Clique para trocar o arquivo' : 'ou clique para selecionar'}</p>
        </div>
      </div>

      {showProgress && (
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {status.error && <span className="status-error">{status.error}</span>}
      {status.success && <span className="status-success">{status.success}</span>}

      <button type="submit" className="primary" disabled={status.loading}>
        {status.loading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  )
}

export default MaterialUploadForm
