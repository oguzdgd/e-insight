import React from 'react'
import { Button } from '../../atoms/Button'

const InputForm = ({url,onSubmit,onChange,loading}) => {
  return (
    <div>
    <input
      type="text"
      value={url}
      placeholder="Ürün linkini girin (ör. Trendyol)"
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '70%', padding: 8 }}
    />
    <Button onClick={onSubmit} disabled={loading} style={{ marginLeft: 10, padding: 8 }}>
      {loading ? 'Yükleniyor...' : 'Yorumları Çek'}
    </Button>
  </div>
  )
}

export default InputForm