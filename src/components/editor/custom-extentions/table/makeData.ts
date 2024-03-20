import { randomColor } from "./utils";

export default function makeData(count: any) {
  let data: any = [];
  let options: any = [];

  let columns = [
    {
      id: "0",
      label: "",
      accessor: "0",
      minWidth: 100,
      dataType: "text",
      options: [],
    },
    {
      id: "1",
      label: "",
      accessor: "1",
      minWidth: 100,
      dataType: "text",
      options: [],
    },
    {
      id: "2",
      label: "",
      accessor: "2",
      width: 100,
      dataType: "text",
      options: [],
    },
  ];
  return { columns: columns, data: data, skipReset: false };
}
