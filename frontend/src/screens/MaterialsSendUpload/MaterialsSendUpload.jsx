import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import MaterialUploadForm from '../../components/MaterialUploadForm'
import './MaterialsSendUpload.css'

const TYPE_LABELS = {
  apostila: 'Apostila',
  resumo: 'Resumo',
  'mapa-mental': 'Mapa Mental',
}

const MaterialsSendUpload = () => {
  const { type } = useParams()
  const label = useMemo(() => TYPE_LABELS[type] || 'Material', [type])

  return (
    <section className="materials-send-upload">
      <header className="materials-header">
        <h2>Enviar {label}</h2>
        <p>Preencha os dados e envie o material selecionado.</p>
      </header>

      <MaterialUploadForm materialType={type} />
    </section>
  )
}

export default MaterialsSendUpload
