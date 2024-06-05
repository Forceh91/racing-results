import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button, { ButtonProps } from "@mui/material/Button";
import Link from "next/link";
import { Event } from "types";
import { TextWithNationalityFlagSuffix } from "components/ui";

type EventHeaderProps = {
  event: Event;
  latestResultUUID: string | null;
  hasAggregatedResults: boolean;
};

const buttonStyle: ButtonProps = { variant: "contained", size: "small", color: "primary" };

export const EventHeader = (props: EventHeaderProps) => {
  const {
    event: { uuid, name, country },
    hasAggregatedResults,
    latestResultUUID,
  } = props;

  const OverallResultsBtn = () => {
    if (!hasAggregatedResults) return <></>;

    return (
      <Link href={`/events/${uuid}/`}>
        <Button {...buttonStyle}>
          <Typography>Overall Results</Typography>
        </Button>
      </Link>
    );
  };

  const ItineraryBtn = () => {
    return (
      <Link href={`/events/${uuid}/itinerary`}>
        <Button {...buttonStyle}>
          <Typography>Itinerary</Typography>
        </Button>
      </Link>
    );
  };

  const StageResultsBtn = () => {
    if (!latestResultUUID) return <></>;

    return (
      <Link href={`/events/${uuid}/results/${latestResultUUID}`}>
        <Button {...buttonStyle}>
          <Typography>Stage Results</Typography>
        </Button>
      </Link>
    );
  };

  return (
    <Box sx={{ mb: 4, display: "flex", flexDirection: "column" }}>
      <Typography variant="h1" sx={{ mb: 2, fontWeight: 500 }}>
        {country ? <TextWithNationalityFlagSuffix nationality={country} text={name} /> : name}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <OverallResultsBtn />
        <StageResultsBtn />
        <ItineraryBtn />
      </Box>
    </Box>
  );
};
