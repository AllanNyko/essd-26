import React, { useState } from 'react';
import colors from '../../config/colors';
import './Estatistica.css';

function Estatistica() {
  const [activeExamIndex, setActiveExamIndex] = useState(null);
  const [pinnedExamIndex, setPinnedExamIndex] = useState(null);

  const performance = {
    best: {
      score: 9.8,
      subjects: ['Matemática', 'Física']
    },
    worst: {
      score: 5.1,
      subjects: ['História', 'Geografia']
    },
    currentAverage: 8.2,
    rankingPosition: 15,
    quizPoints: 2450
  };

  const examScores = [
    6.8, 7.4, 8.1, 7.6, 9.0, 8.5, 7.2, 6.9, 8.8, 9.3,
    7.9, 8.4, 6.5, 7.1, 8.7, 9.1, 8.0, 7.7, 8.9, 9.4
  ];

  const examSubjects = [
    'Matemática', 'Português', 'Física', 'Química', 'Biologia',
    'História', 'Geografia', 'Inglês', 'Artes', 'Filosofia',
    'Sociologia', 'Literatura', 'Redação', 'Ciências', 'Matemática',
    'Português', 'Física', 'Química', 'Biologia', 'História'
  ];

  const userAverageTrend = [
    6.9, 7.2, 7.6, 7.5, 7.9, 8.1, 7.8, 7.7, 8.0, 8.3,
    8.1, 8.2, 7.9, 8.0, 8.4, 8.6, 8.3, 8.2, 8.5, 8.7
  ];

  const overallAverageTrend = [
    7.1, 7.3, 7.4, 7.6, 7.7, 7.8, 7.6, 7.5, 7.7, 7.8,
    7.9, 8.0, 7.8, 7.7, 7.9, 8.0, 8.1, 8.0, 8.1, 8.2
  ];

  const chartHeight = 220;
  const chartPadding = 24;

  const getChartWidth = (count) => Math.max(600, count * 44);

  const buildLinePath = (values, width) => {
    const max = 10;
    const min = 0;
    const step = (width - chartPadding * 2) / (values.length - 1);

    return values
      .map((value, index) => {
        const x = chartPadding + index * step;
        const y = chartHeight - chartPadding - ((value - min) / (max - min)) * (chartHeight - chartPadding * 2);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  const buildPoints = (values, width) => {
    const max = 10;
    const min = 0;
    const step = (width - chartPadding * 2) / (values.length - 1);

    return values.map((value, index) => {
      const x = chartPadding + index * step;
      const y = chartHeight - chartPadding - ((value - min) / (max - min)) * (chartHeight - chartPadding * 2);
      return { x, y, value };
    });
  };

  return (
    <div className="estatistica-page">
      <div className="estatistica-header">
        <h1 style={{ color: colors.text.primary }}>Estatistica</h1>
        <p style={{ color: colors.text.secondary }}>
          Acompanhe sua evolução e desempenho ao longo do tempo.
        </p>
      </div>

      <div className="estatistica-cards">
        <div className="estatistica-card" style={{ borderColor: colors.divider }}>
          <div className="estatistica-card-header">
            <h3 style={{ color: colors.text.primary }}>Visão geral</h3>
            <span style={{ color: colors.text.secondary }}>Último período</span>
          </div>

          <div className="estatistica-card-body">
            <div className="estatistica-metrics">
              <div className="metric-block">
                <span className="metric-label" style={{ color: colors.text.secondary }}>
                  Melhor nota
                </span>
                <div className="metric-value" style={{ color: colors.text.primary }}>
                  {performance.best.score.toFixed(1)}
                </div>
                <div className="metric-subjects" style={{ color: colors.text.secondary }}>
                  {performance.best.subjects.join(', ')}
                </div>
              </div>

              <div className="metric-block">
                <span className="metric-label" style={{ color: colors.text.secondary }}>
                  Pior nota
                </span>
                <div className="metric-value" style={{ color: colors.text.primary }}>
                  {performance.worst.score.toFixed(1)}
                </div>
                <div className="metric-subjects" style={{ color: colors.text.secondary }}>
                  {performance.worst.subjects.join(', ')}
                </div>
              </div>
            </div>

            <div className="estatistica-summary">
              <div className="summary-item" style={{ borderColor: colors.divider }}>
                <span className="summary-label" style={{ color: colors.text.secondary }}>
                  Média atual
                </span>
                <span className="summary-value" style={{ color: colors.text.primary }}>
                  {performance.currentAverage.toFixed(1)}
                </span>
              </div>
              <div className="summary-item" style={{ borderColor: colors.divider }}>
                <span className="summary-label" style={{ color: colors.text.secondary }}>
                  Posição no ranking
                </span>
                <span className="summary-value" style={{ color: colors.text.primary }}>
                  #{performance.rankingPosition}
                </span>
              </div>
              <div className="summary-item" style={{ borderColor: colors.divider }}>
                <span className="summary-label" style={{ color: colors.text.secondary }}>
                  Pontos no quizz
                </span>
                <span className="summary-value" style={{ color: colors.text.primary }}>
                  {performance.quizPoints}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="estatistica-card" style={{ borderColor: colors.divider }}>
          <div className="estatistica-card-header">
            <h3 style={{ color: colors.text.primary }}>Notas por prova</h3>
            <span style={{ color: colors.text.secondary }}>20 provas</span>
          </div>

          <div className="chart-scroll">
            {(() => {
              const width = getChartWidth(examScores.length);
              const path = buildLinePath(examScores, width);
              const points = buildPoints(examScores, width);
              const yTicks = [0, 2, 4, 6, 8, 10];

              return (
                <svg className="line-chart" width={width} height={chartHeight}>
                  {yTicks.map((tick) => {
                    const y = chartHeight - chartPadding - (tick / 10) * (chartHeight - chartPadding * 2);
                    return (
                      <g key={`tick-${tick}`}>
                        <line
                          x1={chartPadding}
                          y1={y}
                          x2={width - chartPadding}
                          y2={y}
                          stroke={colors.divider}
                          strokeDasharray="4 4"
                        />
                        <text
                          x={0}
                          y={y + 4}
                          fontSize="10"
                          fill={colors.text.secondary}
                        >
                          {tick}
                        </text>
                      </g>
                    );
                  })}

                  {examScores.map((_, index) => {
                    const x = chartPadding + index * ((width - chartPadding * 2) / (examScores.length - 1));
                    return (
                      <text
                        key={`x-${index + 1}`}
                        x={x}
                        y={chartHeight - 6}
                        fontSize="10"
                        textAnchor="middle"
                        fill={colors.text.secondary}
                      >
                        {index + 1}
                      </text>
                    );
                  })}

                  <path
                    d={path}
                    fill="none"
                    stroke={colors.primary.main}
                    strokeWidth="3"
                  />

                  {points.map((point, index) => {
                    const subject = examSubjects[index] || `Prova ${index + 1}`;
                    const scoreLabel = `${subject} • ${point.value.toFixed(1)}`;
                    const labelWidth = Math.max(90, subject.length * 7);
                    const labelWidthWithScore = Math.max(120, scoreLabel.length * 7);
                    const labelX = Math.min(
                      Math.max(point.x - labelWidthWithScore / 2, chartPadding),
                      width - chartPadding - labelWidthWithScore
                    );
                    const labelY = Math.max(point.y - 32, 8);
                    const isActive = pinnedExamIndex === index || (pinnedExamIndex === null && activeExamIndex === index);

                    return (
                      <g key={`p-${index}`}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="4"
                          fill={colors.primary.main}
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={() => setActiveExamIndex(index)}
                          onMouseLeave={() => {
                            if (pinnedExamIndex === null) {
                              setActiveExamIndex(null);
                            }
                          }}
                          onClick={() => setPinnedExamIndex(index)}
                        />
                        {isActive && (
                          <g>
                            <rect
                              x={labelX}
                              y={labelY}
                              width={labelWidthWithScore}
                              height={22}
                              rx={6}
                              fill="#ffffff"
                              stroke={colors.divider}
                            />
                            <text
                              x={labelX + labelWidthWithScore / 2}
                              y={labelY + 15}
                              fontSize="11"
                              textAnchor="middle"
                              fill={colors.text.primary}
                            >
                              {scoreLabel}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              );
            })()}
          </div>
        </div>

        <div className="estatistica-card" style={{ borderColor: colors.divider }}>
          <div className="estatistica-card-header">
            <h3 style={{ color: colors.text.primary }}>Comparação de médias</h3>
            <span style={{ color: colors.text.secondary }}>Você x Geral</span>
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: colors.primary.main }} />
              <span style={{ color: colors.text.secondary }}>Sua média</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: colors.text.secondary }} />
              <span style={{ color: colors.text.secondary }}>Média geral</span>
            </div>
          </div>

          <div className="chart-scroll">
            {(() => {
              const width = getChartWidth(userAverageTrend.length);
              const userPath = buildLinePath(userAverageTrend, width);
              const overallPath = buildLinePath(overallAverageTrend, width);
              const userPoints = buildPoints(userAverageTrend, width);
              const overallPoints = buildPoints(overallAverageTrend, width);
              const yTicks = [0, 2, 4, 6, 8, 10];

              return (
                <svg className="line-chart" width={width} height={chartHeight}>
                  {yTicks.map((tick) => {
                    const y = chartHeight - chartPadding - (tick / 10) * (chartHeight - chartPadding * 2);
                    return (
                      <g key={`tick-avg-${tick}`}>
                        <line
                          x1={chartPadding}
                          y1={y}
                          x2={width - chartPadding}
                          y2={y}
                          stroke={colors.divider}
                          strokeDasharray="4 4"
                        />
                        <text
                          x={0}
                          y={y + 4}
                          fontSize="10"
                          fill={colors.text.secondary}
                        >
                          {tick}
                        </text>
                      </g>
                    );
                  })}

                  {userAverageTrend.map((_, index) => {
                    const x = chartPadding + index * ((width - chartPadding * 2) / (userAverageTrend.length - 1));
                    return (
                      <text
                        key={`x-avg-${index + 1}`}
                        x={x}
                        y={chartHeight - 6}
                        fontSize="10"
                        textAnchor="middle"
                        fill={colors.text.secondary}
                      >
                        {index + 1}
                      </text>
                    );
                  })}

                  <path
                    d={overallPath}
                    fill="none"
                    stroke={colors.text.secondary}
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />

                  <path
                    d={userPath}
                    fill="none"
                    stroke={colors.primary.main}
                    strokeWidth="3"
                  />

                  {overallPoints.map((point, index) => (
                    <circle
                      key={`op-${index}`}
                      cx={point.x}
                      cy={point.y}
                      r="2"
                      fill={colors.text.secondary}
                    />
                  ))}

                  {userPoints.map((point, index) => (
                    <circle
                      key={`up-${index}`}
                      cx={point.x}
                      cy={point.y}
                      r="3"
                      fill={colors.primary.main}
                    />
                  ))}
                </svg>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Estatistica;
