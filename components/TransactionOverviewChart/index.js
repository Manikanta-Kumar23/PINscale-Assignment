import { format, parseISO } from "date-fns";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./index.css";

const TransactionOverviewChart = (props) => {
  const DataFormatter = (number) => {
    if (number > 1000) {
      return `${(number / 1000).toString()}k`;
    }
    return number.toString();
  };
  const { data } = props;
  const groupedData = data.reduce((acc, curr) => {
    const existingGroup = acc.find((item) => item.date === curr.date);
    if (existingGroup) {
      existingGroup[curr.type] = curr.sum;
    } else {
      acc.push({ date: curr.date, [curr.type]: curr.sum });
    }
    return acc;
  }, []);
  const formatData = groupedData.map((each) => ({
    debit: each.debit,
    credit: each.credit,
    date: format(parseISO(each.date), "E"),
  }));
  let credit = 0;
  let debit = 0;
  formatData.map((each) => {
    if (each.debit) {
      debit += each.debit;
      return debit;
    } else if (each.credit) {
      credit += each.credit;
      return credit;
    }
    return null;
  });

  return (
    <div className="chart">
      <h1 className="week_cost">
        <span className="span">${debit}</span> Debited &
        <span className="span"> ${credit}</span> Credited this Week
      </h1>
      {credit === 0 && debit === 0 ? (
        <p className="no-data">No Data to show at the given time.</p>
      ) : (
        <ResponsiveContainer width="85%" height={400}>
          <BarChart
            width={500}
            height={400}
            data={formatData}
            margin={{ top: 5 }}
          >
            <XAxis
              dataKey="date"
              tick={{
                stroke: "#6c757d",
                strokeWidth: 1,
                fontSize: 15,
                fontFamily: "Roboto",
              }}
            />
            <YAxis
              tickFormatter={DataFormatter}
              tick={{
                stroke: "#6c757d",
                strokeWidth: 0.5,
                fontSize: 15,
                fontFamily: "Roboto",
              }}
            />
            <Legend
              layout="horizontal"
              align="right"
              verticalAlign="top"
              wrapperStyle={{
                paddingTop: 20,
                textAlign: "center",
                fontSize: 12,
                fontFamily: "Roboto",
                margin: 5,
                radius: [5, 5, 5, 5],
              }}
            />
            <Bar
              dataKey="debit"
              name="Debit"
              fill="#4D78FF"
              radius={[5, 5, 5, 5]}
              barSize="20%"
            />
            <Bar
              dataKey="credit"
              name="Credit"
              fill="#FCAA0B"
              radius={[5, 5, 5, 5]}
              barSize="20%"
              margin="3%"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TransactionOverviewChart;
