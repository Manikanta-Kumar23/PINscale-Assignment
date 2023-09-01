import {useContext} from "react"
import ResourceContext from "../../context/ResourceContext";
import "./index.css";

interface TabType {
  name: string
  id: string
}
interface ComponentProps {
  list: TabType
  isActive: boolean
}

const TransactionType = (props: ComponentProps) => {
  const { list,  isActive } = props;
  const {changeTypeId} = useContext(ResourceContext)
  const { name, id } = list;
  const typeId = () => {
    changeTypeId(id);
  };
  const color = isActive ? "active" : null;
  return (
    <li onClick={typeId} className="transac-nme">
      <p className={`tran-nme ${color}`}>{name}</p>
      {isActive && <hr className="trans-line" />}
    </li>
  );
};

export default TransactionType;
