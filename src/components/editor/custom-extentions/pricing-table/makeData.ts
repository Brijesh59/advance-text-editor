export default function makeData(count: any) {
  let data: any = [];

  let columns = [
    {
      id: "0",
      label: "Name",
      accessor: "0",
      minWidth: 100,
      dataType: "text",
    },
    {
      id: "1",
      label: "Price",
      accessor: "1",
      minWidth: 100,
      dataType: "text",
    },
    {
      id: "2",
      label: "QTY",
      accessor: "2",
      width: 100,
      dataType: "text",
    },
    {
      id: "3",
      label: "Subtotal",
      accessor: "3",
      width: 100,
      dataType: "text",
    },
  ];
  return { columns: columns, data: data, skipReset: false };
}
