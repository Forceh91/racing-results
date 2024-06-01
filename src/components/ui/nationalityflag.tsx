import Box from "@mui/material/Box";
import Flags from "country-flag-icons/react/3x2";

type Props = { nationality: string };

export const NationalityFlag = ({ nationality }: Props) => {
  if (!nationality?.length) return <></>;

  const Flag = Flags[nationality];
  return <Flag style={{ height: "1em", marginRight: 8 }} />;
};

type SuffixProps = { text: string } & Props;
export const TextWithNationalityFlagSuffix = ({ text, nationality }: SuffixProps) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <NationalityFlag nationality={nationality} />
      {text}
    </Box>
  );
};
