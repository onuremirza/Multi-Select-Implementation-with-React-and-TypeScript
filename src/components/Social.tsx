import { Link } from "react-router-dom";
import { IoPerson } from "react-icons/io5";

function Social() {
  return (
    <div className="flex gap-4 justify-center items-center">
      <Link to="https://github.com/onuremirza">
        <img src="https://skillicons.dev/icons?i=github" alt="" />
      </Link>
      <Link to="https://www.linkedin.com/in/onuremirza/">
        <img src="https://skillicons.dev/icons?i=linkedin" alt="" />
      </Link>
      <Link to="https://onuremirza.vercel.app">
        <IoPerson size={48} />
      </Link>
    </div>
  );
}

export default Social;
