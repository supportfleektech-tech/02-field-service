'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export function CreateWorkOrderForm(props:{customers:{id:string;name:string}[]}) {
  const [customerId,setCustomerId]=useState(props.customers[0]?.id||'')
  const [title,setTitle]=useState('')
  const [priority,setPriority]=useState('NORMAL')
  const [loading,setLoading]=useState(false); const router=useRouter()
  const upd=async()=>{ if(!customerId||!title.trim())return
    setLoading(true)
    const res=await fetch('/api/v1/work-orders',{method:'POST',headers:{'content-type':'application/json','x-dev-user-email':'ops@demo.co.ke','x-org-id':'00000000-0000-0000-0000-000000000002'},body:JSON.stringify({customerId,title,priority})})
    setLoading(false); if(res.ok){setTitle('');router.refresh()}else alert('failed')
  }
  return(
    <form onSubmit={e=>{e.preventDefault();upd()}}>
      <select value={customerId} onChange={e=>setCustomerId(e.target.value)} required>{props.customers.map(c=>(<option key={c.id} value={c.id}>{c.name}</option>))}</select>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required/>
      <select value={priority} onChange={e=>setPriority(e.target.value)}>
        <option value="LOW">Low</option><option value="NORMAL">Normal</option><option value="HIGH">High</option><option value="URGENT">Urgent</option>
      </select>
      <button type="submit" disabled={loading}>{loading?'Saving…':'Create work order'}</button>
    </form>
  )
}
export function DispatchButtons(props:{id:string;status:string}) {
  const [loading,setLoading]=useState(false); const router=useRouter()
  if(props.status!=='REQUESTED'&&props.status!=='APPROVED')return null
  return <button className="ghost" onClick={async()=>{ setLoading(true); await fetch(`/api/v1/work-orders/${props.id}/dispatch`,{method:'POST'}); setLoading(false); router.refresh() }}>{props.status==='REQUESTED'?'Dispatch':'Reassign'}</button>
}
export function CompleteButton(props:{id:string;status:string}) {
  const [loading,setLoading]=useState(false); const router=useRouter()
  if(props.status!=='DISPATCHED'&&props.status!=='IN_PROGRESS')return null
  return <button style={{marginTop:8}} onClick={async()=>{ setLoading(true); await fetch(`/api/v1/work-orders/${props.id}/complete`,{method:'POST'}); setLoading(false); router.refresh() }}>Complete</button>
}
