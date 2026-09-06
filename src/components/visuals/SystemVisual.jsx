import { useContent } from '../../content/ContentProvider.jsx'
import { Spark } from '../ui/Primitives.jsx'

/** @param {{kind?: 'browser'|'application'|'infrastructure', hero?: boolean}} props */
export default function SystemVisual({ kind = 'browser', hero = false }) {
  const { brand, ui } = useContent()
  return (
    <figure className={`system-visual visual--${kind} ${hero ? 'workstation' : ''}`}>
      <div className="system-art" aria-hidden="true">
        <div className="visual-cross cross--one">+</div>
        <div className="visual-cross cross--two">+</div>
        <div className="orbital-ring" />
        <div className="orbital-ring ring--two" />
        {hero && (
          <div className="system-stamp">
            <Spark />
            <span className="mono">
              {ui.visualStamp.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </span>
          </div>
        )}
        <div className="retro-window">
          <div className="window-chrome">
            <span className="window-dots">
              <i />
              <i />
              <i />
            </span>
            <span>
              {brand.domain.toLowerCase()} /{' '}
              {kind === 'browser'
                ? 'preview'
                : kind === 'application'
                  ? 'workspace'
                  : 'infrastructure'}
            </span>
            <span>↗</span>
          </div>
          {kind === 'browser' && (
            <div className="browser-demo">
              <div className="demo-nav">
                <Spark />
                <span />
                <span />
                <b>↗</b>
              </div>
              <div className="demo-content">
                <div className="demo-copy">
                  <small>HELLO, WORLD_</small>
                  <strong>{ui.visualTitle}</strong>
                  <span>{ui.visualSubtitle}</span>
                  <i />
                </div>
                <div className="demo-art">
                  <Spark />
                  <div className="demo-orbit" />
                </div>
              </div>
              <div className="demo-tiles">
                <div>
                  <span>01</span>
                  <i />
                  <i />
                </div>
                <div>
                  <span>02</span>
                  <i />
                  <i />
                </div>
                <div>
                  <span>03</span>
                  <i />
                  <i />
                </div>
              </div>
            </div>
          )}
          {kind === 'application' && (
            <div className="app-demo">
              <div className="app-sidebar">
                <Spark />
                {[0, 1, 2, 3].map((index) => (
                  <i key={index} />
                ))}
              </div>
              <div className="app-content">
                <div className="app-top">
                  <span>WORKSPACE</span>
                  <i />
                </div>
                <div className="app-modules">
                  {[0, 1, 2].map((index) => (
                    <div key={index}>
                      <span>0{index + 1}</span>
                      <i />
                      <i />
                    </div>
                  ))}
                </div>
                <div className="app-chart">
                  {[35, 55, 42, 70, 60, 85, 72, 95].map((height, index) => (
                    <i key={index} style={{ height: `${height}%` }} />
                  ))}
                </div>
                <div className="app-table">
                  {ui.visualLog.map((line) => (
                    <div key={line}>
                      <i />
                      <span>{line}</span>
                      <b>→</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {kind === 'infrastructure' && (
            <div className="infra-demo">
              <div className="infra-request">
                <span>HTTPS REQUEST</span>
                <b>↓</b>
              </div>
              <div className="server-stack">
                {['PROXY', 'APPLICATION', 'DATA'].map((name, index) => (
                  <div className="server-unit" key={name}>
                    <span>0{index + 1}</span>
                    <strong>{name}</strong>
                    <div className="server-vents" />
                    <i />
                  </div>
                ))}
              </div>
              <div className="infra-bottom">
                <span>BACKUP</span>
                <i />
                <span>LOGS</span>
              </div>
            </div>
          )}
        </div>
        <div className="terminal-window">
          <div className="terminal-title">
            <span>~/digital-workshop</span>
            <span>_ □</span>
          </div>
          <div className="terminal-lines">
            {ui.visualLog.map((line, index) => (
              <p key={line}>
                <span>0{index + 1}</span>
                <b>↳</b>
                {line}
                <i>✓</i>
              </p>
            ))}
          </div>
        </div>
        <div className="system-modules">
          {ui.visualModules.map((module, index) => (
            <div key={module}>
              <i />
              <span>{module}</span>
              <b>0{index + 1}</b>
            </div>
          ))}
        </div>
        <svg className="system-wire" viewBox="0 0 550 480" fill="none">
          <path d="M450 75h65v300H340v65H70v-90" stroke="currentColor" strokeDasharray="4 6" />
          <circle className="wire-dot" cx="515" cy="200" r="4" fill="currentColor" />
        </svg>
      </div>
      <figcaption className="mono">{ui.illustrative}</figcaption>
    </figure>
  )
}
