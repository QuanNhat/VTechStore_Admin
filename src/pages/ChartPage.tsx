/* eslint-disable */

import BarChart from "@/components/chart/BarChart";
import LineChart from "@/components/chart/LineChart";
import CustomContent from "@/components/common/CustomContent";
import CustomHeader from "@/components/common/CustomHeader";
import { Col, Empty, Row } from "antd";

const examLabels = ["Doanh thu", "Chi phí", "Lợi nhuận"];
const examValues = [12, 19, 3];

const ChartPage = () => {
  // const [values, setValues] = useState(examValues);
  // const [labels, setLabels] = useState(examLabels || []);

  // const handleGetList = async () => {
  //   const today = new Date();
  //   const tenDaysAgo = new Date(today);
  //   tenDaysAgo.setDate(today.getDate() - 10);

  //   const formatDateBegin = formatDate(tenDaysAgo);
  //   const formatDateEnd = formatDate(today);

  //   try {
  //     const res = await paypalService.getReport(formatDateBegin, formatDateEnd);
  //     if (res?.data) {
  //       const result: number[] = Object.values(res?.data);
  //       setValues(result);
  //     } else {
  //       // toast.error("Error handleGetList ChartPage");
  //     }
  //   } catch (error) {
  //     console.log("error: ", error);
  //     toast.error("Error handleGetList ChartReport");
  //   }
  // };

  //   useEffect(() => {
  //     if (user) {
  //       handleGetList();
  //     }
  //   }, [user]);

  return (
    <div>
      <CustomHeader title="Thống kê" />

      <CustomContent>
        {examLabels?.length > 0 ? (
          <Row>
            <Col span={12}>
              <BarChart labels={examLabels} values={examValues} />
            </Col>

            <Col span={12}>
              <LineChart labels={examLabels} values={examValues} />
            </Col>
          </Row>
        ) : (
          <Empty />
        )}
      </CustomContent>
    </div>
  );
};

export default ChartPage;
