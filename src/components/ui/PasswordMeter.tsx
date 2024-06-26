"use client";

import LinearProgress, {
  linearProgressClasses,
  type LinearProgressProps,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";

interface IProps {
  value: string;
  LinearProgressProps: LinearProgressProps;
}

function PasswordMeter({
  value,
  LinearProgressProps,
}: IProps): React.ReactNode {
  const t = useTranslations("PageChangePassword");

  const valueLength = value.length;
  const minLength = 8;
  const hue = Math.min(valueLength * 10, 120);

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: `hsl(${hue} 80% 50%)`,
    },
  }));

  return (
    <>
      <BorderLinearProgress
        {...LinearProgressProps}
        value={Math.min((valueLength * 100) / minLength, 100)}
      />

      <Typography
        variant="caption"
        sx={{ alignSelf: "flex-end", color: `hsl(${hue} 60% 50%)` }}
      >
        {valueLength < 3 && t("level1")}
        {valueLength >= 3 && valueLength < 6 && t("level2")}
        {valueLength >= 6 && valueLength < 10 && t("level3")}
        {valueLength >= 10 && t("level4")}
      </Typography>
    </>
  );
}

export default PasswordMeter;
