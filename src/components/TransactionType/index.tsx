import "./index.css";

interface TabType {
  name: string;
  id: string;
}
interface ComponentProps {
  list: TabType;
  isActive: boolean;
  changeTypeId: (id: string) => void;
}

const TransactionType = (props: ComponentProps) => {
  const { list, isActive, changeTypeId } = props;
  const { name, id } = list;
  const typeId = () => {
    changeTypeId(id);
  };
  const color = isActive ? "active" : null;
  return (
    <li onClick={typeId} className="transaction-type-list">
      <p className={`transaction-type-name ${color}`}>{name}</p>
      {isActive && <hr className="transaction-line" />}
    </li>
  );
};

export default TransactionType;
