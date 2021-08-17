import React, {Suspense} from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(16),
    height: theme.spacing(16),
    border: '2px solid #ccc'
  },
}));
 
export default function ProfileLogoComponent(props) {
  const classes = useStyles();

  return (
    <Suspense fallback={<div>loading...</div>}>
      <Avatar src={props.imageId} className={classes.large} />
    </Suspense>
  )
}