import AdminMenu from "../../components/admin/AdminMenu";

export default function Dashboard() {

  return (
    <div className="h-screen flex flex-col sm:flex-row w-full">
      <div className="flex-1">
        <AdminMenu />
      </div>
      <div className="flex-4">content</div>
    </div>
   
  );
}