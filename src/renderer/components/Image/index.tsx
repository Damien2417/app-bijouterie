import React, { PropsWithChildren } from 'react'

import styles from './styles.module.sass'

type Image = PropsWithChildren<React.ImgHTMLAttributes<HTMLImageElement>>

export function Image({ srcImage }: Image) {
  return (
    <img src={srcImage} className={styles.icon}/>
  )
}
