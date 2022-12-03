import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent, {
  timelineContentClasses,
} from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import { Box, SxProps, Typography } from "@mui/material";

export interface ICustomTimeLine {
  children?: React.ReactNode;
}

export interface ICustomTimeLineItem {
  children?: React.ReactNode;
  time?: string;
  dotColor?:string;
  connectorColor?: string;
  sx?: SxProps
}

export const CustomTimeLineItem = ({ children, time, dotColor, connectorColor, sx }: ICustomTimeLineItem) => {
  return (
    <TimelineItem sx={sx}>
      <TimelineOppositeContent color="textSecondary">
        {time}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot sx={{ bgcolor: dotColor || "green" }} />
        <TimelineConnector sx={{ bgcolor: connectorColor || "green" }} />
      </TimelineSeparator>
      <TimelineContent>
       {
        children
       }
      </TimelineContent>
    </TimelineItem>
  );
};

export const CustomLastTimeLineItem = ({
  children,
  time,
  dotColor
}: ICustomTimeLineItem) => {
  return (
    <TimelineItem>
      <TimelineOppositeContent color="textSecondary" sx={{width: ''}}>
        {time}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot sx={{ bgcolor: dotColor || "green" }} />
      </TimelineSeparator>
      <TimelineContent>{children}</TimelineContent>
    </TimelineItem>
  );
};

export default function CustomTimeline({ children }: ICustomTimeLine) {
  return (
    <Timeline
      sx={{
        [`& .${timelineContentClasses.root}`]: {
          mb: 6,
          flex: 40
        },
      }}
    >
      {children}
    </Timeline>
  );
}
