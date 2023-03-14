import { Navbar, Welcome, Footer, Transactions, Services } from "./components";

export default function App() {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar/>
        <Welcome/>
      </div>

    </div>
  )
}