import React from 'react'
import Select from 'react-select'

export const SelectCourse = ({options, field, form, ...props } : any) => {
  return (<Select
    options={options}
    name={field.name}
    value={options ? options.find((option: { value: any }) => option.value === field.value) : ''}
    onChange={(option: any) => form.setFieldValue(field.name, option.value)}
    onBlur={field.onBlur}
  />)
}