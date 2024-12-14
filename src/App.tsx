import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { useDebounce } from "ahooks";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Slider,
  Space,
  Typography
} from "antd";
import { useWatch } from "antd/es/form/Form";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import PieChart from "./PieChart";

function App() {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesForm] = Form.useForm();
  const [revenuesForm] = Form.useForm();
  const [form] = Form.useForm();
  const formWatcher = useWatch(null, form);
  const revenuesFormWatcher = useWatch(null, revenuesForm);

  const debounced = useDebounce(formWatcher, { wait: 500 });

  const calculateSum = (): number => {
    if (!formWatcher) return 0;
    return Object.values(formWatcher as Record<string, number>).reduce(
      (acc: number, curr: number) => acc + (curr || 0),
      0
    );
  };

  const handleSubmit = (values: { name: string }) => {
    setCategories([...categories, values.name]);
    categoriesForm.resetFields();
  };

  const extraContent = (
    <Form onFinish={handleSubmit} form={categoriesForm}>
      <Space>
        <Form.Item name="name" noStyle>
          <Input placeholder="Categoria" />
        </Form.Item>
        <Button
          type="primary"
          shape="circle"
          htmlType="submit"
          icon={<PlusOutlined />}
        />
      </Space>
    </Form>
  );

  return (
    <Layout style={{ minHeight: "100vh", padding: "16px" }}>
      <Typography.Title level={3}>Calculadora de orçamento</Typography.Title>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Valores %" extra={extraContent}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Typography.Text style={{ color: calculateSum() > 100 ? 'red' : 'black' }}>Total: {calculateSum()}%</Typography.Text>
              <Form form={form} layout="vertical">
                {categories.map((category) => (
                  <Row gutter={16} key={category}>
                    <Col span={22}>
                      <Form.Item label={category} name={category}>
                        <Slider
                          marks={{
                            0: "0%",
                            20: "20%",
                            50: "50%",
                            80: "80%",
                            100: "100%",
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <DeleteFilled
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setCategories(
                            categories.filter((c) => c !== category)
                          )
                        }
                      />
                    </Col>
                  </Row>
                ))}
              </Form>
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Demonstrativo R$"
            extra={
              <Form form={revenuesForm}>
                <Space>
                  <span>Total de receitas: </span>
                  <Form.Item noStyle name="value">
                    <NumericFormat
                      decimalSeparator=","
                      thousandSeparator="."
                      prefix="R$ "
                      customInput={Input}
                      onChange={(e) =>
                        revenuesForm.setFieldValue(
                          "value",
                          (e.target.value ?? "0")
                            .replace("R$ ", "")
                            .replace(".", "")
                            .replace(",", ".")
                        )
                      }
                    />
                  </Form.Item>
                </Space>
              </Form>
            }
          >
            <PieChart
              revenues={revenuesFormWatcher?.value ?? 0}
              data={Object.entries(debounced ?? {}).map(([key, value]) => ({
                type: key,
                value,
              }))}
            />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}

export default App;
