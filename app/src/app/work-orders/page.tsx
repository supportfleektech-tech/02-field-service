import { prisma } from '@/lib/db'
import { CreateWorkOrderForm, DispatchButtons, CompleteButton } from './ui'
export const dynamic='force-dynamic'
export default async function WorkOrdersPage(){
  const org=await prisma.organization.findFirst()
  const customers=org?await prisma.customer.findMany({where:{organizationId:org.id},orderBy:{name:'asc'}}):[]
  const wos=org?await prisma.workOrder.findMany({where:{organizationId:org.id},orderBy:{createdAt:'desc'},include:{customer:{select:{name:true}},technician:{select:{name:true}}}}):[]
  return (
    <>
      <h1>Work Orders</h1>
      <div className="card" style={{marginBottom:16}}><h3>New work order</h3><CreateWorkOrderForm customers={customers}/></div>
      <div className="card"><h3>All work orders</h3>
        <table>
          <thead><tr><th>#</th><th>Title</th><th>Customer</th><th>Tech</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {wos.map(w=>(
              <tr key={w.id}>
                <td>{w.number}</td><td>{w.title}</td><td>{w.customer.name}</td><td>{w.technician?.name||'—'}</td>
                <td><span className={`badge s-${w.status}`}>{w.status}</span></td>
                <td><DispatchButtons id={w.id} status={w.status}/><CompleteButton id={w.id} status={w.status}/></td>
              </tr>
            ))}
            {wos.length===0&&<tr><td colSpan={6}>No work orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}
