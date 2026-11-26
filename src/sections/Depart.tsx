import { data } from '../lib/data'
import { Photo } from './shared'

export function Depart() {
  return (
    <footer id="depart" data-ground="photo">
      <Photo name="depart" alt="Container ship steaming out past the Visakhapatnam harbour breakwater" />
      <div className="wrap depart-copy">
        <h2>Thank you.</h2>
        <p className="line">Let&apos;s build something together:</p>
        <nav className="depart-cta" aria-label="Connect">
          <a href="https://www.linkedin.com/in/almasuddinmallick-letsconnect/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="tel:+918341946277">+91 83419 46277</a>
          <a href="/assets/aistudio/Almas_Uddin_Mallick_CV_2026_efd58db1.pdf" target="_blank" rel="noopener noreferrer">
            CV (PDF)
          </a>
        </nav>
        <p className="small">Independent student project by Almas Uddin Mallick. Data to {data.meta.asOf}. Images are illustrations.</p>
      </div>
    </footer>
  )
}
