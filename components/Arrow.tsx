import { FunctionComponent } from 'react';

import styles from '../styles/Arrow.module.css';

export const Arrow: FunctionComponent = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.arrowDown} />
      <div className={styles.content}>{children}</div>
      <div className={styles.arrowUp} />
    </div>
  );
};
