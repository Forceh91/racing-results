import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { SxProps } from "@mui/material";
import Link from "next/link";
import MuiLink from "@mui/material/Link";
import { ItineraryEntry } from "types";

type StageListProps = {
  eventUUID: string;
  stages: ItineraryEntry[];
  currentStage: number;
};

const boxSx: SxProps = {
  border: "1px solid",
  borderColor: "divider",
  p: 1,
  minWidth: "50px",
  textAlign: "center",
};

export const StageList = (props: StageListProps) => {
  const { eventUUID, stages, currentStage } = props;

  if (!stages?.length) return <></>;

  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
      {stages
        .sort((a, b) => a.event_result_number - b.event_result_number)
        .map((stage, ix, _stages) => (
          <>
            {_stages[ix - 1]?.leg !== stage.leg ? (
              <Box
                sx={{ ...boxSx, backgroundColor: "action.disabledBackground", borderColor: "divider" }}
                key={`${stage.uuid}-leg-identifier`}
              >
                <Typography noWrap>Leg {stage.leg}</Typography>
              </Box>
            ) : (
              <></>
            )}
            <MuiLink
              component={Link}
              href={`/events/${eventUUID}/results/${stage.uuid}`}
              style={{ textDecoration: "none" }}
              key={stage.uuid}
            >
              <Box
                key={stage.uuid}
                sx={{
                  ...boxSx,
                  "&:hover": { backgroundColor: "action.hover" },
                  backgroundColor: stage.event_result_number === currentStage ? "action.selected" : "",
                }}
              >
                <Typography>SS{stage.event_result_number}</Typography>
              </Box>
            </MuiLink>
          </>
        ))}
    </Box>
  );
};
