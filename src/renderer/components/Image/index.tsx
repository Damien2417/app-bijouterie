import React, { PropsWithChildren } from 'react'

import styles from './styles.module.sass'

type Image = PropsWithChildren<React.ImgHTMLAttributes<HTMLImageElement>>

export function Image({ srcImage, func }: Image) {
  return (
    <img src={srcImage} onClick={func}className={styles.icon}/>
  )
}
