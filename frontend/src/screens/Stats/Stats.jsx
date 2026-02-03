import { useEffect, useMemo, useState } from 'react'
import { API_BASE_URL, parseJson } from '../../lib/api'
import './Stats.css'

const formatAverage = (value) => (
  Number(value || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
)

const Stats = () => {
  const [subjects, setSubjects] = useState([])
  const [notes, setNotes] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [comparisonNotes, setComparisonNotes] = useState([])
  const [status, setStatus] = useState({ loading: true, error: '' })

  const [comparisonType, setComparisonType] = useState('global')
  const [comparisonUserId, setComparisonUserId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [pointTooltip, setPointTooltip] = useState(null)
  const [subjectTooltip, setSubjectTooltip] = useState(null)

  const storedUser = localStorage.getItem('essd_user')
  const currentUser = storedUser ? JSON.parse(storedUser) : null
  const userId = currentUser?.id

  useEffect(() => {
    let active = true

    const loadData = async () => {
      if (!userId) {
        if (active) {
          setStatus({ loading: false, error: 'Usuário não autenticado.' })
        }
        return
      }

      setStatus({ loading: true, error: '' })

      try {
        const [subjectsResponse, notesResponse, rankingResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/subjects`, { headers: { Accept: 'application/json' } }),
          fetch(`${API_BASE_URL}/notes?user_id=${userId}`, { headers: { Accept: 'application/json' } }),
          fetch(`${API_BASE_URL}/ranking`, { headers: { Accept: 'application/json' } }),
        ])

        const subjectsData = await parseJson(subjectsResponse)
        const notesData = await parseJson(notesResponse)
        const rankingData = await parseJson(rankingResponse)

        if (!active) return

        setSubjects(subjectsData?.subjects || [])
        setNotes(notesData?.notes || [])
        setAllUsers(rankingData?.ranking || [])

        if ((rankingData?.ranking || []).length > 0 && !comparisonUserId) {
          setComparisonUserId(String(rankingData.ranking[0].id))
        }

        setStatus({ loading: false, error: '' })
      } catch (error) {
        if (active) {
          setStatus({ loading: false, error: error.message || 'Erro ao carregar dados.' })
        }
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [userId])

  useEffect(() => {
    let active = true

    const loadComparisonNotes = async () => {
      if (comparisonType !== 'user' || !comparisonUserId) {
        setComparisonNotes([])
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/notes?user_id=${comparisonUserId}`, {
          headers: { Accept: 'application/json' },
        })
        const data = await parseJson(response)

        if (response.ok && active) {
          setComparisonNotes(data?.notes || [])
        }
      } catch {
        if (active) {
          setComparisonNotes([])
        }
      }
    }

    loadComparisonNotes()

    return () => {
      active = false
    }
  }, [comparisonType, comparisonUserId])

  const userAverage = useMemo(() => {
    const totalSubjects = subjects.length
    if (totalSubjects === 0) return 0

    const totalScore = notes.reduce((acc, note) => acc + (Number(note.score) || 0), 0)
    return totalScore / totalSubjects
  }, [notes, subjects.length])

  const globalAverage = useMemo(() => {
    if (!allUsers.length) return 0

    const sum = allUsers.reduce((acc, user) => acc + (Number(user.average_score) || 0), 0)
    return sum / allUsers.length
  }, [allUsers])

  const comparisonAverage = useMemo(() => {
    if (comparisonType === 'global') {
      return globalAverage
    }

    const totalSubjects = subjects.length
    if (totalSubjects === 0) return 0

    const totalScore = comparisonNotes.reduce((acc, note) => acc + (Number(note.score) || 0), 0)
    return totalScore / totalSubjects
  }, [comparisonType, globalAverage, comparisonNotes, subjects.length])

  const difference = userAverage - comparisonAverage

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return allUsers

    const term = searchTerm.toLowerCase()
    return allUsers.filter((user) => 
      user.name.toLowerCase().includes(term) || 
      String(user.id).includes(term)
    )
  }, [allUsers, searchTerm])

  const selectedUser = useMemo(() => {
    return allUsers.find((user) => String(user.id) === String(comparisonUserId))
  }, [allUsers, comparisonUserId])

  // Calcular médias por matéria para o usuário
  const userSubjectAverages = useMemo(() => {
    const bySubject = {}
    notes.forEach(note => {
      if (!bySubject[note.subject_id]) {
        bySubject[note.subject_id] = { sum: 0, count: 0, notes: [] }
      }
      bySubject[note.subject_id].sum += Number(note.score) || 0
      bySubject[note.subject_id].count += 1
      bySubject[note.subject_id].notes.push(Number(note.score) || 0)
    })
    return Object.entries(bySubject).map(([subjectId, data]) => ({
      subjectId: parseInt(subjectId),
      average: data.sum / data.count,
      notes: data.notes
    }))
  }, [notes])

  // Calcular médias por matéria para a comparação
  const comparisonSubjectAverages = useMemo(() => {
    if (comparisonType === 'global') {
      // Média global por matéria: calcular média de todos os usuários para cada matéria
      const bySubject = {}
      allUsers.forEach(user => {
        const userNotes = user.notes || []
        userNotes.forEach(note => {
          if (!bySubject[note.subject_id]) {
            bySubject[note.subject_id] = { sum: 0, count: 0, notes: [] }
          }
          bySubject[note.subject_id].sum += Number(note.score) || 0
          bySubject[note.subject_id].count += 1
          bySubject[note.subject_id].notes.push(Number(note.score) || 0)
        })
      })
      return Object.entries(bySubject).map(([subjectId, data]) => ({
        subjectId: parseInt(subjectId),
        average: data.sum / data.count,
        notes: data.notes
      }))
    } else {
      // Média do usuário selecionado por matéria
      const bySubject = {}
      comparisonNotes.forEach(note => {
        if (!bySubject[note.subject_id]) {
          bySubject[note.subject_id] = { sum: 0, count: 0, notes: [] }
        }
        bySubject[note.subject_id].sum += Number(note.score) || 0
        bySubject[note.subject_id].count += 1
        bySubject[note.subject_id].notes.push(Number(note.score) || 0)
      })
      return Object.entries(bySubject).map(([subjectId, data]) => ({
        subjectId: parseInt(subjectId),
        average: data.sum / data.count,
        notes: data.notes
      }))
    }
  }, [comparisonType, comparisonNotes, allUsers])

  // Preparar dados do gráfico
  const chartData = useMemo(() => {
    const data = subjects.map(subject => {
      const userAvg = userSubjectAverages.find(s => s.subjectId === subject.id)
      const compAvg = comparisonSubjectAverages.find(s => s.subjectId === subject.id)
      return {
        subject,
        userAverage: userAvg?.average || 0,
        userNotes: userAvg?.notes || [],
        comparisonAverage: compAvg?.average || 0,
        comparisonNotes: compAvg?.notes || []
      }
    })
    return data
  }, [subjects, userSubjectAverages, comparisonSubjectAverages])

  // Função para encurtar nome da matéria
  const shortenSubjectName = (name) => {
    if (name.length <= 12) return name
    return name.substring(0, 12) + '...'
  }

  return (
    <section className="stats">
      <header className="stats-header">
        <h2>Central de Estatísticas</h2>
        <p>Análise completa de desempenho e comparação com outros usuários.</p>
      </header>

      {status.loading && (
        <div className="stats-status stats-status--loading">
          Carregando estatísticas...
        </div>
      )}

      {status.error && (
        <div className="stats-status stats-status--error">
          {status.error}
        </div>
      )}

      {!status.loading && !status.error && (
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-card-header">
              <h3>Comparação de Médias</h3>
              <p>Veja como sua média se compara com a média global ou com outro usuário.</p>
            </div>

            <div className="comparison-controls">
              <div className="stats-filter">
                <label htmlFor="comparison-type">Comparar com</label>
                <select
                  id="comparison-type"
                  value={comparisonType}
                  onChange={(e) => setComparisonType(e.target.value)}
                >
                  <option value="global">Média Global</option>
                  <option value="user">Outro Usuário</option>
                </select>
              </div>

              {comparisonType === 'user' && (
                <>
                  <div className="stats-filter">
                    <label htmlFor="user-search">Buscar usuário (nome ou ID)</label>
                    <input
                      id="user-search"
                      type="text"
                      placeholder="Digite nome ou ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="stats-filter">
                    <label htmlFor="comparison-user">Selecionar usuário</label>
                    <select
                      id="comparison-user"
                      value={comparisonUserId}
                      onChange={(e) => setComparisonUserId(e.target.value)}
                    >
                      {filteredUsers.length === 0 && <option value="">Nenhum usuário encontrado</option>}
                      {filteredUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} (ID: {user.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="comparison-results">
              <div className="comparison-metric">
                <span className="comparison-label">Sua Média</span>
                <strong className="comparison-value">{formatAverage(userAverage)}</strong>
                <span className="comparison-help">Baseado em {notes.length} nota{notes.length !== 1 ? 's' : ''}</span>
              </div>

              <div className="comparison-divider">
                <span className={`comparison-indicator ${difference >= 0 ? 'positive' : 'negative'}`}>
                  {difference >= 0 ? '↑' : '↓'} {formatAverage(Math.abs(difference))}
                </span>
                <span className="comparison-status">
                  {difference >= 0 ? 'acima' : 'abaixo'}
                </span>
              </div>

              <div className="comparison-metric">
                <span className="comparison-label">
                  {comparisonType === 'global' ? 'Média Global' : `Média de ${selectedUser?.name || 'Usuário'}`}
                </span>
                <strong className="comparison-value">{formatAverage(comparisonAverage)}</strong>
                <span className="comparison-help">
                  {comparisonType === 'global' 
                    ? `Baseado em ${allUsers.length} usuário${allUsers.length !== 1 ? 's' : ''}`
                    : `Baseado em ${comparisonNotes.length} nota${comparisonNotes.length !== 1 ? 's' : ''}`
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Card: Gráfico por Matéria */}
          <div className="stats-card">
            <div className="stats-card-header">
              <h3>Desempenho por Matéria</h3>
              <p>
                Comparação das médias entre {comparisonType === 'global' ? 'você e a média geral' : selectedUser ? `você e ${selectedUser.name}` : 'você e outro usuário'}
              </p>
            </div>

            {chartData.length === 0 ? (
              <div className="stats-status stats-status--loading">
                Nenhuma matéria disponível
              </div>
            ) : (
              <div className="subject-chart">
                <svg className="subject-chart-svg" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
                  {/* Grid lines */}
                  <line x1="60" y1="20" x2="60" y2="220" stroke="#e2e8f0" strokeWidth="2" />
                  <line x1="60" y1="220" x2="740" y2="220" stroke="#e2e8f0" strokeWidth="2" />
                  
                  {/* Y-axis labels */}
                  {[0, 2.5, 5, 7.5, 10].map((val) => (
                    <g key={val}>
                      <line
                        x1="55"
                        y1={220 - (val * 20)}
                        x2="740"
                        y2={220 - (val * 20)}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                      />
                      <text
                        x="50"
                        y={220 - (val * 20) + 4}
                        textAnchor="end"
                        fontSize="12"
                        fill="#64748b"
                      >
                        {val.toFixed(1)}
                      </text>
                    </g>
                  ))}

                  {/* Lines */}
                  {chartData.length > 1 && (
                    <>
                      {/* User line */}
                      <polyline
                        points={chartData.map((d, i) => {
                          const x = 100 + (i * (640 / (chartData.length - 1)))
                          const y = 220 - (d.userAverage * 20)
                          return `${x},${y}`
                        }).join(' ')}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3"
                      />
                      
                      {/* Comparison line */}
                      <polyline
                        points={chartData.map((d, i) => {
                          const x = 100 + (i * (640 / (chartData.length - 1)))
                          const y = 220 - (d.comparisonAverage * 20)
                          return `${x},${y}`
                        }).join(' ')}
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                      />
                    </>
                  )}

                  {/* Data points */}
                  {chartData.map((d, i) => {
                    const x = chartData.length === 1 ? 400 : 100 + (i * (640 / (chartData.length - 1)))
                    const userY = 220 - (d.userAverage * 20)
                    const compY = 220 - (d.comparisonAverage * 20)
                    
                    return (
                      <g key={d.subject.id}>
                        {/* User point */}
                        <circle
                          cx={x}
                          cy={userY}
                          r="6"
                          fill="#2563eb"
                          stroke="#ffffff"
                          strokeWidth="2"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setPointTooltip(pointTooltip?.id === `user-${d.subject.id}` ? null : {
                            id: `user-${d.subject.id}`,
                            x,
                            y: userY,
                            title: 'Suas notas',
                            subject: d.subject.name,
                            average: d.userAverage,
                            notes: d.userNotes
                          })}
                        />
                        
                        {/* Comparison point */}
                        <circle
                          cx={x}
                          cy={compY}
                          r="6"
                          fill="#94a3b8"
                          stroke="#ffffff"
                          strokeWidth="2"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setPointTooltip(pointTooltip?.id === `comp-${d.subject.id}` ? null : {
                            id: `comp-${d.subject.id}`,
                            x,
                            y: compY,
                            title: comparisonType === 'global' ? 'Média geral' : selectedUser?.name || 'Outro usuário',
                            subject: d.subject.name,
                            average: d.comparisonAverage,
                            notes: d.comparisonNotes
                          })}
                        />
                      </g>
                    )
                  })}
                </svg>

                {/* X-axis labels (subject names) */}
                <div className="subject-chart-labels">
                  {chartData.map((d) => (
                    <div
                      key={d.subject.id}
                      className="subject-label"
                      onClick={() => setSubjectTooltip(subjectTooltip === d.subject.id ? null : d.subject.id)}
                    >
                      {shortenSubjectName(d.subject.name)}
                      {subjectTooltip === d.subject.id && (
                        <div className="subject-label-tooltip">
                          {d.subject.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="subject-chart-legend">
                  <div className="legend-item">
                    <span className="legend-dot legend-dot--user"></span>
                    <span>Você</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot legend-dot--comparison"></span>
                    <span>{comparisonType === 'global' ? 'Média Geral' : selectedUser?.name || 'Outro Usuário'}</span>
                  </div>
                </div>

                {/* Point tooltip */}
                {pointTooltip && (
                  <div 
                    className="point-tooltip"
                    style={{
                      position: 'absolute',
                      left: `${(pointTooltip.x / 800) * 100}%`,
                      top: `${((pointTooltip.y - 40) / 300) * 100}%`,
                      transform: 'translate(-50%, -100%)'
                    }}
                  >
                    <div className="point-tooltip-header">
                      <strong>{pointTooltip.title}</strong>
                      <button 
                        className="point-tooltip-close"
                        onClick={() => setPointTooltip(null)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="point-tooltip-body">
                      <p className="point-tooltip-subject">{pointTooltip.subject}</p>
                      <p className="point-tooltip-average">
                        Média: <strong>{formatAverage(pointTooltip.average)}</strong>
                      </p>
                      <div className="point-tooltip-notes">
                        <p>Notas:</p>
                        <div className="point-tooltip-notes-list">
                          {pointTooltip.notes.length > 0 ? (
                            pointTooltip.notes.map((note, idx) => (
                              <span key={idx} className="note-badge">{formatAverage(note)}</span>
                            ))
                          ) : (
                            <span className="note-empty">Nenhuma nota</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default Stats
