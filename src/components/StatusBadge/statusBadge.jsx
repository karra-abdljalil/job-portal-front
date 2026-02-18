import { APPLICATION_STATUS } from "../../constants/StatusConstant";

export default function StatusBadge({ status }) {
 
   const statusConfig = Object.values(APPLICATION_STATUS).find(
    (item) => item.value === status
  );

  const bgColor = statusConfig?.bg || "#6c757d";
  const textColor = statusConfig?.text || "#ffffff";

  return (
    <span
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: "5px 25px",
        borderRadius: "12px",
        textTransform: "capitalize",
        fontWeight: "500",
      }}
    >
      {status}
    </span>
  );
}
