import { Voyage } from '../components/Voyage'
import { data } from '../lib/data'

export function Welcome() {
  return (
    <Voyage>
      <div className="wrap hero">
        <img className="logo" src="/media/logo.webp" alt="Emblem of Visakhapatnam Port Authority" width="76" height="96" />
        <div className="hero-copy">
          <h1 id="welcome-h">Visakhapatnam Port Authority</h1>
          <p className="line">{data.copy.welcome.line}</p>
          <p className="small">Independent student project. Not the official website.</p>
        </div>
      </div>
    </Voyage>
  )
}
