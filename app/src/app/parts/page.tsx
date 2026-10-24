import { prisma } from '@/lib/db'
export const dynamic='force-dynamic'
export default async function PartsPage(){
  const org=await prisma.organization.findFirst()
  const parts=org?await prisma.part.findMany({where:{organizationId:org.id},orderBy:{name:'asc'}}):[]
  const usage=org?await prisma.partUsage.findMany({where:{part:{organizationId:org.id}},include:{part:true,workOrder:true},orderBy:{createdAt:'desc'}}):[]
  return(
    <>
      <h1>Parts</h1>
      <div className="card"><h3>Inventory</h3>
        <table><thead><tr><th>SKU</th><th>Name</th><th>On hand</th><th>Unit cost</th></tr></thead><tbody>
        {parts.map(p=>(<tr key={p.id}><td>{p.sku}</td><td>{p.name}</td><td>{p.quantityOnHand}</td><td>KSh {(p.unitCostCents/100).toLocaleString('en-KE')}</td></tr>))}
        {parts.length===0&&<tr><td colSpan={4}>No parts yet.</td></tr>}
        </tbody></table>
      </div>
      <div className="card" style={{marginTop:12}}><h3>Recent usage</h3>
        <table><thead><tr><th>Part</th><th>Work order</th><th>Qty</th></tr></thead><tbody>
        {usage.map(u=>(<tr key={u.id}><td>{u.part.name}</td><td>{u.workOrder.number}</td><td>{u.quantity}</td></tr>))}
        {usage.length===0&&<tr><td colSpan={3}>No usage recorded.</td></tr>}
        </tbody></table>
      </div>
    </>
  )
}
