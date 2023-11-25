import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { _ResultEventItinerary } from "types";
import { SxProps } from "@mui/material";
import Link from "next/link";

type StageListProps = {
  eventUUID: string;
  stages: _ResultEventItinerary[];
  currentStage: number;
};

const boxSx: SxProps = {
  border: "1px solid #bbb",
  p: 1,
  minWidth: "50px",
  textAlign: "center",
  borderLeft: 0,
};

export const StageList = (props: StageListProps) => {
  const { eventUUID, stages, currentStage } = props;

  if (!stages?.length) return <></>;

  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
      <Box sx={{ ...boxSx, borderColor: "#999", borderLeft: 1 }}>
        <Typography sx={{ fontWeight: 600 }}>Stage</Typography>
      </Box>
      {stages
        .sort((a, b) => a.event_result_number - b.event_result_number)
        .map((stage, ix, _stages) => (
          <>
            {_stages[ix - 1]?.leg !== stage.leg ? (
              <Box sx={{ ...boxSx, background: "#ccc", borderColor: "#999" }} key={`${stage.uuid}-leg-identifier`}>
                <Typography>Leg {stage.leg}</Typography>
              </Box>
            ) : (
              <></>
            )}
            <Link
              href={`/events/${eventUUID}/results/${stage.uuid}`}
              style={{ textDecoration: "none" }}
              key={stage.uuid}
            >
              <Box
                key={stage.uuid}
                sx={{
                  ...boxSx,
                  "&:hover": { background: "#ddd" },
                  backgroundColor: stage.event_result_number === currentStage ? "#d9d9d9" : "",
                }}
              >
                <Typography>{stage.event_result_number}</Typography>
              </Box>
            </Link>
          </>
        ))}
    </Box>
  );
};
