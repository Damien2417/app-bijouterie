import { PropsWithChildren } from 'react'

import styles from './styles.module.sass'

export function SideBarContainer({ children }: PropsWithChildren<{}>) {
  return <section className={styles.main}>{children}</section>
}
