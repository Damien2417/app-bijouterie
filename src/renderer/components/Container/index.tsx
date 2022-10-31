import { PropsWithChildren } from 'react'

import styles from './styles.module.sass'

export function Container({ children }: PropsWithChildren<{}>) {
  return <section className={styles.main}>{children}</section>
}
