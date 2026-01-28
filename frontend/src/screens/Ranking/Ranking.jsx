import { useEffect, useState } from 'react'
import './Ranking.css'

const Ranking = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const ranking = [
    {
      id: 1,
      name: 'Ana Souza',
      avatar: 'https://i.pravatar.cc/80?img=32',
      average: '8,7',
      points: 1280,
    },
    {
      id: 2,
      name: 'Bruno Lima',
      avatar: 'https://i.pravatar.cc/80?img=12',
      average: '8,4',
      points: 1195,
    },
    {
      id: 3,
      name: 'Carla Menezes',
      avatar: 'https://i.pravatar.cc/80?img=47',
      average: '8,1',
      points: 1102,
    },
    {
      id: 4,
      name: 'Diego Almeida',
      avatar: 'https://i.pravatar.cc/80?img=21',
      average: '8,0',
      points: 1040,
    },
    {
      id: 5,
      name: 'Eduarda Reis',
      avatar: 'https://i.pravatar.cc/80?img=18',
      average: '7,9',
      points: 980,
    },
    {
      id: 6,
      name: 'Felipe Rocha',
      avatar: 'https://i.pravatar.cc/80?img=5',
      average: '7,8',
      points: 945,
    },
    {
      id: 7,
      name: 'Gabriela Nunes',
      avatar: 'https://i.pravatar.cc/80?img=9',
      average: '7,7',
      points: 910,
    },
    {
      id: 8,
      name: 'Henrique Paiva',
      avatar: 'https://i.pravatar.cc/80?img=24',
      average: '7,6',
      points: 880,
    },
    {
      id: 9,
      name: 'Isabela Costa',
      avatar: 'https://i.pravatar.cc/80?img=27',
      average: '7,5',
      points: 845,
    },
    {
      id: 10,
      name: 'João Pedro',
      avatar: 'https://i.pravatar.cc/80?img=30',
      average: '7,4',
      points: 820,
    },
    {
      id: 11,
      name: 'Karen Oliveira',
      avatar: 'https://i.pravatar.cc/80?img=41',
      average: '7,3',
      points: 795,
    },
    {
      id: 12,
      name: 'Lucas Ferreira',
      avatar: 'https://i.pravatar.cc/80?img=36',
      average: '7,2',
      points: 770,
    },
    {
      id: 13,
      name: 'Marina Dias',
      avatar: 'https://i.pravatar.cc/80?img=44',
      average: '7,1',
      points: 745,
    },
    {
      id: 14,
      name: 'Nicolas Batista',
      avatar: 'https://i.pravatar.cc/80?img=52',
      average: '7,0',
      points: 720,
    },
    {
      id: 15,
      name: 'Otávia Ramos',
      avatar: 'https://i.pravatar.cc/80?img=56',
      average: '6,9',
      points: 695,
    },
    {
      id: 16,
      name: 'Paulo Henrique',
      avatar: 'https://i.pravatar.cc/80?img=58',
      average: '6,8',
      points: 670,
    },
    {
      id: 17,
      name: 'Renata Lopes',
      avatar: 'https://i.pravatar.cc/80?img=60',
      average: '6,7',
      points: 645,
    },
    {
      id: 18,
      name: 'Samuel Freitas',
      avatar: 'https://i.pravatar.cc/80?img=62',
      average: '6,6',
      points: 620,
    },
  ]

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
          <div className="ranking-avatar" aria-hidden="true">
            <img src="https://i.pravatar.cc/80?img=15" alt="Seu avatar" />
          </div>
          <div className="ranking-info">
            <span className="ranking-name">Seu desempenho</span>
            <span className="ranking-metric">Média: 8,9</span>
          </div>
          <div className="ranking-points">1420 pts</div>
        </div>
      </div>

      <div className="ranking-card">
        <div className="ranking-list">
          {ranking.map((user, index) => (
            <div className="ranking-item" key={user.id}>
              <div className="ranking-position">#{index + 1}</div>
              <div className="ranking-avatar" aria-hidden="true">
                <img src={user.avatar} alt={user.name} />
              </div>
              <div className="ranking-info">
                <span className="ranking-name">{user.name}</span>
                <span className="ranking-metric">Média: {user.average}</span>
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
