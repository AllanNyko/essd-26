import { useEffect, useMemo, useState } from 'react'
import { API_BASE_URL, parseJson } from '../../lib/api'
import './Stats.css'

const PERIODS = [
  { value: '7', label: 'Últimos 7 dias' },
  { value: '30', label: 'Últimos 30 dias' },
  { value: '90', label: 'Últimos 90 dias' },
  { value: 'all', label: 'Todo o período' },
]

const formatPercent = (value) => `${Math.round(value)}%`

const clampPercent = (value) => Math.max(0, Math.min(100, value || 0))

const formatAverage = (value) => (
  Number(value || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  })
)

const buildLinePoints = (series) => {
  if (!series.length) return ''
  if (series.length === 1) {
    return `0,${100 - series[0].percent}`
  }

  return series
    .map((item, index) => {
      const x = (index / (series.length - 1)) * 100
      const y = 100 - item.percent
      return `${x},${y}`
    })
    .join(' ')
}

const Stats = () => {
  const [subjects, setSubjects] = useState([])
  const [notices, setNotices] = useState([])
  const [notes, setNotes] = useState([])
  const [ranking, setRanking] = useState([])
  const [score, setScore] = useState(null)
  const [quizStatsData, setQuizStatsData] = useState({
    stats: { total_questions: 0, hits: 0, errors: 0, accuracy_percentage: 0 },
    subjects: [],
  })
  const [comparisonNotes, setComparisonNotes] = useState([])
  const [status, setStatus] = useState({ loading: true, error: '' })

  const [period, setPeriod] = useState('30')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [noticeFilter, setNoticeFilter] = useState('all')
  const [comparison, setComparison] = useState('media')
  const [comparisonUserId, setComparisonUserId] = useState('')
  const [quizSubjectFilter, setQuizSubjectFilter] = useState('all')

  const storedUser = localStorage.getItem('essd_user')
  const currentUser = storedUser ? JSON.parse(storedUser) : null
  const userId = currentUser?.id

  useEffect(() => {
    let active = true

    const loadInitialData = async () => {
      if (!userId) {
        if (active) {
          setStatus({ loading: false, error: 'Usuário não autenticado.' })
        }
        return
      }

      setStatus({ loading: true, error: '' })

      try {
        const [subjectsResponse, noticesResponse, notesResponse, rankingResponse, scoreResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/subjects`, { headers: { Accept: 'application/json' } }),
            fetch(`${API_BASE_URL}/notices`, { headers: { Accept: 'application/json' } }),
            fetch(`${API_BASE_URL}/notes?user_id=${userId}`, { headers: { Accept: 'application/json' } }),
            fetch(`${API_BASE_URL}/ranking`, { headers: { Accept: 'application/json' } }),
            fetch(`${API_BASE_URL}/scores?user_id=${userId}`, { headers: { Accept: 'application/json' } }),
          ])

        const subjectsData = await parseJson(subjectsResponse)
        const noticesData = await parseJson(noticesResponse)
        const notesData = await parseJson(notesResponse)
        const rankingData = await parseJson(rankingResponse)
        const scoreData = await parseJson(scoreResponse)

        if (!active) {
          return
        }

        setSubjects(subjectsData?.subjects || [])
        setNotices(noticesData?.notices || [])
        setNotes(notesData?.notes || [])
        setRanking(rankingData?.ranking || [])
        setScore(scoreData?.score || null)

        if ((rankingData?.ranking || []).length > 0) {
          setComparisonUserId(String(rankingData.ranking[0].id))
        }

        setStatus({ loading: false, error: '' })
      } catch (error) {
        if (active) {
          setStatus({ loading: false, error: error.message || 'Não foi possível carregar as estatísticas.' })
        }
      }
    }

    loadInitialData()

    return () => {
      active = false
    }
  }, [userId])

  useEffect(() => {
    let active = true

    const loadQuizStats = async () => {
      if (!userId) {
        return
      }

      const params = new URLSearchParams({ user_id: String(userId) })
      if (quizSubjectFilter !== 'all') {
        params.set('subject_id', quizSubjectFilter)
      }
      if (period !== 'all') {
        params.set('period_days', period)
      }

      try {
        const response = await fetch(`${API_BASE_URL}/quiz-stats?${params.toString()}`, {
          headers: { Accept: 'application/json' },
        })
        const data = await parseJson(response)

        if (response.ok && active) {
          setQuizStatsData({
            stats: data?.stats || { total_questions: 0, hits: 0, errors: 0, accuracy_percentage: 0 },
            subjects: data?.subjects || [],
          })
        }
      } catch {
        if (active) {
          setQuizStatsData({
            stats: { total_questions: 0, hits: 0, errors: 0, accuracy_percentage: 0 },
            subjects: [],
          })
        }
      }
    }

    loadQuizStats()

    return () => {
      active = false
    }
  }, [period, quizSubjectFilter, userId])

  useEffect(() => {
    let active = true

    const loadComparisonNotes = async () => {
      if (comparison !== 'usuario' || !comparisonUserId) {
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
  }, [comparison, comparisonUserId])

  const filterNotesBySettings = (notesList) => {
    const now = new Date()
    const days = period === 'all' ? null : Number(period)

    return notesList.filter((note) => {
      if (noticeFilter !== 'all' && String(note.notice_id) !== noticeFilter) {
        return false
      }

      if (subjectFilter !== 'all' && String(note.subject_id) !== subjectFilter) {
        return false
      }

      if (!days) {
        return true
      }

      if (!note.created_at) {
        return true
      }

      const createdAt = new Date(note.created_at)
      if (Number.isNaN(createdAt.getTime())) {
        return true
      }

      const diffTime = now.getTime() - createdAt.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      return diffDays <= days
    })
  }

  const filteredNotes = useMemo(() => (
    filterNotesBySettings(notes)
  ), [notes, noticeFilter, period, subjectFilter])

  const filteredComparisonNotes = useMemo(() => (
    filterNotesBySettings(comparisonNotes)
  ), [comparisonNotes, noticeFilter, period, subjectFilter])

  const filteredSubjects = useMemo(() => {
    if (subjectFilter === 'all') {
      return subjects
    }

    return subjects.filter((subject) => String(subject.id) === subjectFilter)
  }, [subjects, subjectFilter])

  const overallAverage = useMemo(() => {
    const totalSubjects = filteredSubjects.length
    if (totalSubjects === 0) {
      return 0
    }

    const totalScore = filteredNotes.reduce((acc, note) => acc + (Number(note.score) || 0), 0)
    return totalScore / totalSubjects
  }, [filteredNotes, filteredSubjects.length])

  const globalAveragePercent = useMemo(() => {
    if (!ranking.length) {
      return 0
    }

    const sum = ranking.reduce((acc, item) => acc + (Number(item.average_score) || 0), 0)
    return clampPercent((sum / ranking.length) * 10)
  }, [ranking])

  const comparisonAverage = useMemo(() => {
    if (comparison === 'media') {
      return globalAveragePercent / 10
    }

    if (!comparisonUserId) {
      return 0
    }

    const totalSubjects = filteredSubjects.length
    if (totalSubjects === 0) {
      return 0
    }

    const totalScore = filteredComparisonNotes.reduce((acc, note) => acc + (Number(note.score) || 0), 0)

    return totalScore / totalSubjects
  }, [comparison, filteredComparisonNotes, filteredSubjects.length, globalAveragePercent])

  const comparisonDiff = overallAverage - comparisonAverage

  const quizStats = useMemo(() => {
    const totalFromStats = Number(quizStatsData?.stats?.total_questions || 0)
    const statsHits = Number(quizStatsData?.stats?.hits || 0)
    const statsErrors = Number(quizStatsData?.stats?.errors || 0)
    const scoreHits = (score?.individual_hits || 0) + (score?.survivor_hits || 0)
    const scoreErrors = (score?.individual_errors || 0) + (score?.survivor_errors || 0)

    const useScoreFallback = quizSubjectFilter === 'all' && totalFromStats === 0
    const hits = useScoreFallback ? scoreHits : statsHits
    const errors = useScoreFallback ? scoreErrors : statsErrors
    const total = hits + errors
    const accuracy = total > 0 ? (hits / total) * 100 : 0

    return {
      hits,
      errors,
      total,
      accuracy: clampPercent(accuracy),
      errorsPercent: clampPercent(total > 0 ? 100 - accuracy : 0),
      points: (score?.individual_points || 0) + (score?.survivor_points || 0),
    }
  }, [quizStatsData, quizSubjectFilter, score])

  const orderedSubjects = useMemo(() => {
    const subjectMap = new Map(filteredSubjects.map((subject) => [String(subject.id), subject]))
    const orderedByNote = [...filteredNotes]
      .sort((a, b) => {
        const aDate = new Date(a.created_at)
        const bDate = new Date(b.created_at)
        const aTime = Number.isNaN(aDate.getTime()) ? 0 : aDate.getTime()
        const bTime = Number.isNaN(bDate.getTime()) ? 0 : bDate.getTime()
        if (aTime === bTime) {
          return (Number(a.id) || 0) - (Number(b.id) || 0)
        }
        return aTime - bTime
      })
      .map((note) => String(note.subject_id))
      .filter((id, index, arr) => arr.indexOf(id) === index)
      .map((id) => subjectMap.get(id))
      .filter(Boolean)

    const remaining = filteredSubjects.filter(
      (subject) => !orderedByNote.some((item) => item.id === subject.id),
    )

    return [...orderedByNote, ...remaining]
  }, [filteredNotes, filteredSubjects])

  const quizSubjects = useMemo(() => {
    if (!quizStatsData?.subjects?.length) {
      return []
    }

    const statsMap = new Map(
      quizStatsData.subjects.map((item) => [String(item.subject_id), item]),
    )

    const ordered = orderedSubjects
      .map((subject) => statsMap.get(String(subject.id)))
      .filter(Boolean)

    return ordered.map((item) => ({
      id: item.subject_id,
      name: item.subject_name,
      hits: item.hits,
      errors: item.errors,
      accuracy: clampPercent(Number(item.accuracy_percentage || 0)),
      total: item.total_questions,
    }))
  }, [orderedSubjects, quizStatsData])

  const selectedQuizSubject = useMemo(() => {
    if (quizSubjectFilter === 'all') {
      return null
    }

    return quizSubjects.find((subject) => String(subject.id) === String(quizSubjectFilter)) || null
  }, [quizSubjectFilter, quizSubjects])

  const displayQuizStats = useMemo(() => quizStats, [quizStats])

  const subjectSeries = useMemo(() => {
    const notesBySubject = filteredNotes.reduce((acc, note) => {
      acc[String(note.subject_id)] = Number(note.score) || 0
      return acc
    }, {})

    return orderedSubjects.map((subject) => {
      const rawScore = notesBySubject[String(subject.id)]
      const hasScore = typeof rawScore === 'number' && rawScore > 0
      return {
        id: subject.id,
        label: subject.name,
        percent: clampPercent((rawScore || 0) * 10),
        missing: !hasScore,
      }
    })
  }, [filteredNotes, orderedSubjects])

  const comparisonSeries = useMemo(() => {
    if (comparison === 'media') {
      return subjectSeries.map((subject) => ({
        ...subject,
        percent: globalAveragePercent,
        missing: false,
      }))
    }

    const notesBySubject = filteredComparisonNotes.reduce((acc, note) => {
      acc[String(note.subject_id)] = Number(note.score) || 0
      return acc
    }, {})

    return orderedSubjects.map((subject) => {
      const rawScore = notesBySubject[String(subject.id)]
      const hasScore = typeof rawScore === 'number' && rawScore > 0
      return {
        id: subject.id,
        label: subject.name,
        percent: clampPercent((rawScore || 0) * 10),
        missing: !hasScore,
      }
    })
  }, [comparison, filteredComparisonNotes, orderedSubjects, globalAveragePercent, subjectSeries])

  const periodLabel = PERIODS.find((item) => item.value === period)?.label || 'Todo o período'

  return (
    <section className="stats">
      <header className="stats-header">
        <h2>Central de Estatísticas</h2>
        <p>Visão geral de desempenho, acertos, erros e progresso.</p>
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

      <div className="stats-filters">
        <div className="stats-filter">
          <label htmlFor="periodo">Período</label>
          <select id="periodo" value={period} onChange={(event) => setPeriod(event.target.value)}>
            {PERIODS.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>

        <div className="stats-filter">
          <label htmlFor="materia">Matéria</label>
          <select
            id="materia"
            value={subjectFilter}
            onChange={(event) => setSubjectFilter(event.target.value)}
          >
            <option value="all">Todas</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>

        <div className="stats-filter">
          <label htmlFor="edital">Edital</label>
          <select id="edital" value={noticeFilter} onChange={(event) => setNoticeFilter(event.target.value)}>
            <option value="all">Todos</option>
            {notices.map((notice) => (
              <option key={notice.id} value={notice.id}>{notice.name}</option>
            ))}
          </select>
        </div>

        <div className="stats-filter">
          <label htmlFor="comparacao">Comparação</label>
          <select id="comparacao" value={comparison} onChange={(event) => setComparison(event.target.value)}>
            <option value="media">Média geral</option>
            <option value="usuario">Usuário específico</option>
          </select>
        </div>

        <div className="stats-filter">
          <label htmlFor="usuario">Usuário</label>
          <select
            id="usuario"
            value={comparisonUserId}
            onChange={(event) => setComparisonUserId(event.target.value)}
            disabled={comparison !== 'usuario'}
          >
            {ranking.length === 0 && <option value="">Sem usuários</option>}
            {ranking.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stats-card stats-summary">
          <div>
            <p className="stats-label">Média geral do aluno</p>
            <h3>{formatAverage(overallAverage)}</h3>
            <p className="stats-help">Cálculo: soma das notas ÷ total de matérias</p>
          </div>
          <div>
            <p className="stats-label">Comparação selecionada</p>
            <h3>{formatAverage(comparisonAverage)}</h3>
            <p className={`stats-diff ${comparisonDiff >= 0 ? 'positive' : 'negative'}`}>
              {comparisonDiff >= 0 ? '+' : ''}{formatAverage(Math.abs(comparisonDiff))} {comparisonDiff >= 0 ? 'acima' : 'abaixo'}
            </p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <div>
              <h3>Evolução ao longo das provas</h3>
              <p>Comparativo da média do aluno com a média geral ou outro usuário.</p>
            </div>
            <span className="stats-badge">{periodLabel}</span>
          </div>
          {subjectSeries.length === 0 ? (
            <div className="stats-empty">Registre notas para visualizar a evolução ao longo do tempo.</div>
          ) : (
            <div className="stats-line-chart">
              <svg className="stats-line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                {comparisonSeries.length > 0 && (
                  <polyline
                    className="stats-line-path stats-line-path--compare"
                    points={buildLinePoints(comparisonSeries)}
                  />
                )}
                {subjectSeries.length > 0 && (
                  <polyline
                    className="stats-line-path stats-line-path--user"
                    points={buildLinePoints(subjectSeries)}
                  />
                )}
              </svg>
              <div className="stats-line-dots">
                {comparisonSeries.map((item, index) => (
                  <span
                    key={`c-${item.label}-${index}`}
                    className={`stats-line-dot stats-line-dot--compare${item.missing ? ' stats-line-dot--missing' : ''}`}
                    style={{
                      left: `${comparisonSeries.length === 1 ? 0 : (index / (comparisonSeries.length - 1)) * 100}%`,
                      bottom: `${item.percent}%`,
                    }}
                    title={`${item.label} • ${item.missing ? 'Sem nota' : formatPercent(item.percent)}`}
                    aria-label={`${item.label} • ${item.missing ? 'Sem nota' : formatPercent(item.percent)}`}
                    data-tooltip={`${item.label} • ${item.missing ? 'Sem nota' : formatPercent(item.percent)}`}
                  />
                ))}
                {subjectSeries.map((item, index) => (
                  <span
                    key={`u-${item.label}-${index}`}
                    className={`stats-line-dot stats-line-dot--user${item.missing ? ' stats-line-dot--missing' : ''}`}
                    style={{
                      left: `${subjectSeries.length === 1 ? 0 : (index / (subjectSeries.length - 1)) * 100}%`,
                      bottom: `${item.percent}%`,
                    }}
                    title={`${item.label} • ${item.missing ? 'Sem nota' : formatPercent(item.percent)}`}
                    aria-label={`${item.label} • ${item.missing ? 'Sem nota' : formatPercent(item.percent)}`}
                    data-tooltip={`${item.label} • ${item.missing ? 'Sem nota' : formatPercent(item.percent)}`}
                  />
                ))}
              </div>
              <div className="stats-line-legend">
                <span><i className="dot dot-user" />Aluno</span>
                <span><i className="dot dot-compare" />{comparison === 'media' ? 'Média geral' : 'Usuário comparado'}</span>
              </div>
              <div className="stats-line-labels">
                {subjectSeries.map((item, index) => (
                  <span key={`${item.label}-${index}`}>{item.label}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <div>
              <h3>Desempenho em Quizz</h3>
              <p>Taxa de acertos e erros no total e por matéria.</p>
            </div>
            <div className="stats-card-actions">
              <span className="stats-badge">Todos os modos</span>
              <div className="stats-filter stats-filter--inline">
                <label htmlFor="quiz-materia">Matéria</label>
                <select
                  id="quiz-materia"
                  value={quizSubjectFilter}
                  onChange={(event) => setQuizSubjectFilter(event.target.value)}
                >
                  <option value="all">Todas</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="quiz-chart">
            <div className="quiz-metric">
              <span>Taxa de acertos{selectedQuizSubject ? ` (${selectedQuizSubject.name})` : ' geral'}</span>
              <strong>{displayQuizStats.hits}</strong>
              <div className="quiz-meter">
                <span style={{ width: `${displayQuizStats.accuracy}%` }} />
              </div>
              <small>{formatPercent(displayQuizStats.accuracy)} de acerto</small>
            </div>
            <div className="quiz-metric">
              <span>Taxa de erros{selectedQuizSubject ? ` (${selectedQuizSubject.name})` : ' geral'}</span>
              <strong>{displayQuizStats.errors}</strong>
              <div className="quiz-meter quiz-meter--danger">
                <span style={{ width: `${displayQuizStats.errorsPercent}%` }} />
              </div>
              <small>{formatPercent(displayQuizStats.errorsPercent)} de erro</small>
            </div>
            <div className="quiz-summary">
              <div>
                <p>Acertos totais{selectedQuizSubject ? ` (${selectedQuizSubject.name})` : ''}</p>
                <strong>{displayQuizStats.hits}</strong>
              </div>
              <div>
                <p>Erros totais{selectedQuizSubject ? ` (${selectedQuizSubject.name})` : ''}</p>
                <strong>{displayQuizStats.errors}</strong>
              </div>
              <div>
                <p>Total{selectedQuizSubject ? ` (${selectedQuizSubject.name})` : ''}</p>
                <strong>{displayQuizStats.total}</strong>
              </div>
            </div>
            {!selectedQuizSubject && (
              <div className="quiz-summary">
                <div>
                  <p>Pontos</p>
                  <strong>{quizStats.points}</strong>
                </div>
              </div>
            )}
            <div className="quiz-subjects">
              <div className="quiz-subjects-header">
                <h4>Detalhe por matéria</h4>
                <span>{subjectFilter === 'all' ? 'Todas as matérias' : 'Matéria selecionada'}</span>
              </div>
              {quizSubjects.length === 0 ? (
                <div className="stats-empty">
                  Sem respostas registradas para o filtro atual.
                </div>
              ) : (
                <div className="quiz-subjects-list">
                  {quizSubjects.map((subject) => (
                    <div key={subject.id} className="quiz-subject">
                      <div className="quiz-subject-header">
                        <strong>{subject.name}</strong>
                        <span>{formatPercent(subject.accuracy)}</span>
                      </div>
                      <div className="quiz-subject-bars">
                        <div>
                          <small>Acertos</small>
                          <div className="quiz-meter">
                            <span style={{ width: `${subject.accuracy}%` }} />
                          </div>
                        </div>
                        <div>
                          <small>Erros</small>
                          <div className="quiz-meter quiz-meter--danger">
                            <span style={{ width: `${100 - subject.accuracy}%` }} />
                          </div>
                        </div>
                      </div>
                      <div className="quiz-subject-footer">
                        <span>Acertos: {subject.hits}</span>
                        <span>Erros: {subject.errors}</span>
                        <span>Total: {subject.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Stats
