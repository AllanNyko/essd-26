import { useEffect, useMemo, useState } from 'react'
import { API_BASE_URL, parseJson, getAuthHeaders } from '../../lib/api'
import './Ranking.css'

const Ranking = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const { currentUserId, currentUserSnapshot } = useMemo(() => {
    const storedUser = localStorage.getItem('essd_user')
    const currentUser = storedUser ? JSON.parse(storedUser) : null
    return {
      currentUserId: currentUser?.id ? Number(currentUser.id) : 5,
      currentUserSnapshot: currentUser,
    }
  }, [])
  const users = useMemo(() => ([
    {
      id: 1,
      name: 'Ana Souza',
      avatar: 'https://i.pravatar.cc/80?img=32',
      points: 1280,
    },
    {
      id: 2,
      name: 'Bruno Lima',
      avatar: 'https://i.pravatar.cc/80?img=12',
      points: 1195,
    },
    {
      id: 3,
      name: 'Carla Menezes',
      avatar: 'https://i.pravatar.cc/80?img=47',
      points: 1102,
    },
    {
      id: 4,
      name: 'Diego Almeida',
      avatar: 'https://i.pravatar.cc/80?img=21',
      points: 1040,
    },
    {
      id: 5,
      name: 'Eduarda Reis',
      avatar: 'https://i.pravatar.cc/80?img=18',
      points: 980,
    },
    {
      id: 6,
      name: 'Felipe Rocha',
      avatar: 'https://i.pravatar.cc/80?img=5',
      points: 945,
    },
    {
      id: 7,
      name: 'Gabriela Nunes',
      avatar: 'https://i.pravatar.cc/80?img=9',
      points: 910,
    },
    {
      id: 8,
      name: 'Henrique Paiva',
      avatar: 'https://i.pravatar.cc/80?img=24',
      points: 880,
    },
    {
      id: 9,
      name: 'Isabela Costa',
      avatar: 'https://i.pravatar.cc/80?img=27',
      points: 845,
    },
    {
      id: 10,
      name: 'João Pedro',
      avatar: 'https://i.pravatar.cc/80?img=30',
      points: 820,
    },
    {
      id: 11,
      name: 'Karen Oliveira',
      avatar: 'https://i.pravatar.cc/80?img=41',
      points: 795,
    },
    {
      id: 12,
      name: 'Lucas Ferreira',
      avatar: 'https://i.pravatar.cc/80?img=36',
      points: 770,
    },
    {
      id: 13,
      name: 'Marina Dias',
      avatar: 'https://i.pravatar.cc/80?img=44',
      points: 745,
    },
    {
      id: 14,
      name: 'Nicolas Batista',
      avatar: 'https://i.pravatar.cc/80?img=52',
      points: 720,
    },
    {
      id: 15,
      name: 'Otávia Ramos',
      avatar: 'https://i.pravatar.cc/80?img=56',
      points: 695,
    },
    {
      id: 16,
      name: 'Paulo Henrique',
      avatar: 'https://i.pravatar.cc/80?img=58',
      points: 670,
    },
    {
      id: 17,
      name: 'Renata Lopes',
      avatar: 'https://i.pravatar.cc/80?img=60',
      points: 645,
    },
    {
      id: 18,
      name: 'Samuel Freitas',
      avatar: 'https://i.pravatar.cc/80?img=62',
      points: 620,
    },
  ]), [])

  useEffect(() => {
    let active = true

    const loadRanking = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/ranking`, {
          headers: getAuthHeaders(),
        })
        const data = await parseJson(response)

        if (!response.ok || !Array.isArray(data?.ranking)) {
          return
        }

        const fallbackById = users.reduce((acc, user) => {
          acc[user.id] = user
          return acc
        }, {})

        const normalized = data.ranking
          .map((entry) => ({
            id: entry.id,
            name: entry.name,
            avatar: entry.avatar_url || fallbackById[entry.id]?.avatar,
            points: Number(entry.quiz_points ?? 0),
            average: Number(entry.average_score ?? 0),
          }))
          .sort((a, b) => b.average - a.average)
          .map((entry, index) => ({ ...entry, rank: index + 1 }))

        if (active) {
          setRanking(normalized)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadRanking()

    return () => {
      active = false
    }
  }, [users])

  const formatAverage = (value) => Number(value).toFixed(1).replace('.', ',')

  const rankingData = ranking.length > 0
    ? ranking
    : users.map((user, index) => ({
      ...user,
      average: 0,
      rank: index + 1,
    }))

  const currentUserFromRanking = rankingData.find((user) => user.id === currentUserId)
  const currentUser = currentUserFromRanking || (currentUserSnapshot ? {
    id: Number(currentUserSnapshot.id),
    name: currentUserSnapshot.name,
    avatar: currentUserSnapshot.avatar_url || currentUserSnapshot.avatar,
    points: Number(currentUserSnapshot.quiz_points ?? 0),
    average: Number(currentUserSnapshot.average_score ?? 0),
    rank: currentUserSnapshot.rank,
  } : null)
  const rankingList = rankingData.filter((user) => user.id !== currentUserId)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 120)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="ranking">
      <header className="ranking-header">
        <h2>Ranking</h2>
        <p>Confira os melhores desempenhos da comunidade.</p>
      </header>

      <div className="ranking-user-card">
        <div className="ranking-user">
          <div className="ranking-position">#{currentUser?.rank ?? '-'}</div>
          <div className="ranking-avatar" aria-hidden="true">
            <img src={currentUser?.avatar || currentUserSnapshot?.avatar_url || currentUserSnapshot?.avatar || 'https://i.pravatar.cc/80?img=15'} alt="Seu avatar" />
          </div>
          <div className="ranking-info">
            <span className="ranking-name">{currentUser?.name || currentUserSnapshot?.name || 'Seu desempenho'}</span>
            <span className="ranking-metric">
              Média: {currentUser ? formatAverage(currentUser.average) : (loading ? '...' : '-')}
            </span>
          </div>
          <div className="ranking-points">
            {currentUser?.points ?? (loading ? '...' : '-')} pts
          </div>
        </div>
      </div>

      <div className="ranking-card">
        <div className="ranking-list">
          {rankingList.map((user) => (
            <div className="ranking-item" key={user.id}>
              <div className="ranking-position">#{user.rank}</div>
              <div className="ranking-avatar" aria-hidden="true">
                <img src={user.avatar || 'https://i.pravatar.cc/80?img=15'} alt={user.name} />
              </div>
              <div className="ranking-info">
                <span className="ranking-name">{user.name}</span>
                <span className="ranking-metric">
                  Média: {formatAverage(user.average)}
                </span>
              </div>
              <div className="ranking-points">{user.points} pts</div>
            </div>
          ))}
        </div>
      </div>

      {showScrollTop && (
        <button
          type="button"
          className="ranking-scroll-top"
          onClick={handleScrollTop}
          aria-label="Voltar ao topo"
        >
          ↑
        </button>
      )}
    </section>
  )
}

export default Ranking
