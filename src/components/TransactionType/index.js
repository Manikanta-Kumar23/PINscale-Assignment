import "./index.css";

const TransactionType = (props) => {
  const { list, changeTypeId, isActive } = props;
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
