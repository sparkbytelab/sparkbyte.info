import signal from '../../assets/signal-frame.svg?no-inline'
import { useContent } from '../../content/ContentProvider.jsx'

export default function SignalVisual() {
  const { ui } = useContent()
  return (
    <figure className="signal-visual workstation">
      <img src={signal} alt={ui.signalAlt} width={800} height={1000} fetchPriority="high" />
    </figure>
  )
}
