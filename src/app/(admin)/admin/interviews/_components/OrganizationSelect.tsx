'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Organization = {
  id: string
  name: string
}

interface OrganizationSelectProps {
  organizations: Organization[]
  value: string | null
  onChange: (value: string | null) => void
}

export function OrganizationSelect({
  organizations,
  value,
  onChange,
}: OrganizationSelectProps) {
  return (
    <Select
      value={value || 'none'}
      onValueChange={(val) => onChange(val === 'none' ? null : val)}
    >
      <SelectTrigger>
        <SelectValue placeholder="団体を選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">紐付けなし</SelectItem>
        {organizations.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
