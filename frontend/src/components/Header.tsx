import Messenger from "./Messenger";
import { useState } from "react";

const Header = () => {
  const [isMessengerOpen, setMessengerOpen] = useState<boolean>(false);
  return (
    <section className="header">
      <h2>Header</h2>
      <button onClick={() => setMessengerOpen(!isMessengerOpen)}>Messenger</button>

      {isMessengerOpen && <Messenger></Messenger>}
    </section>
  )
}

export default Header;