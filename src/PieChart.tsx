import { Pie, PieConfig } from "@ant-design/plots";

const PieChart = ({
  data,
  revenues,
}: {
  data: Record<string, unknown>[];
  revenues: number;
}) => {
  const config: PieConfig = {
    data: data.map((item) => {
      return {
        type: item.type,
        value: parseFloat(
          (revenues * ((item.value as number) / 100)).toFixed(2)
        ),
      };
    }),
    angleField: "value",
    colorField: "type",
    innerRadius: 0.6,
    tooltip: (data) => {
      const value = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(data.value);

      return `${data.type}: ${value}`;
    },
    label: {
      text: (data: any) => {
        return new Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(data.value);
      },
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
    annotations: [
      {
        type: "text",
        style: {
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 40,
          fontStyle: "bold",
        },
      },
    ],
  };
  return <Pie {...config} height={400} />;
};

export default PieChart;
