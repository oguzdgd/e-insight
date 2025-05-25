import React from 'react'
import { Button } from '../../atoms/Button'
import styles from '../InputForm/InputForm.module.scss'

const InputForm = ({url,onSubmit,onChange,loading}) => {
  return (
    <div className={styles.inputForm}>
    <input
      type="text"
      value={url}
      placeholder="Ürün linkini girin (ör. Trendyol)"
      onChange={(e) => onChange(e.target.value)}
      className={styles.input} 
    />
    <Button onClick={onSubmit} disabled={loading} className={styles.button}>
      {loading ? 'Yükleniyor...' : 'Yorumları Çek'}
    </Button>
  </div>
  )
}

export default InputForm