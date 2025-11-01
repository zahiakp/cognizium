"use client";;
import { useState } from "react";
import Modal from "./Modal";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { showMessage } from "./CusToast";
import { MarkAwarded } from "../../app/judgement/func";

function AwardCard({ close,program, fetchPrograms }: { close: any; program:any ,fetchPrograms:any }) {
  const [cookies] = useCookies(["access"]);
  const [role, setRole] = useState(cookies?.access?.role);
  const router = useRouter();
  const {jamiaNo} = cookies?.access
  const campus = cookies.access?.campusId;
  const [loading, setLoading] = useState(false);
  const [deleteItem,setDeleteItem] = useState<any>()
  
  console.log(program);
  

  const [userRole, setUserRole] = useState();
  
   const markAwarded = async (id:any) => {
       setLoading(true);
   
       try {
         
         const result = await MarkAwarded(id,'awarded');
      if(result){
    showMessage("student awarded successfully.", "success");
    
    fetchPrograms()
    close(false);
   }else{
    showMessage("Some participants failed to update", "error");
   }
        
       } catch (error: any) {
         showMessage(`Error: ${error.message}`, "error");
       } finally {
         setLoading(false);
       }
     };

  return (
    <Modal close={close}>
      <div className="flex flex-col gap-3 md:w-fit max-h-[80%]">
        <h6 className="font-bold text-xl mb-3 w-full text-center">
          {program.name}
        </h6>
        <table className="table table-zebra">
                          <thead>
                            <tr>
                              <th>Rank</th>
                              <th>Grade</th>
                              <th>Name</th>
                              <th>campus</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {program.results.map((item: any, index: number) => (
                                 <tr key={index} className="grid-cols-6">
                                 <th>{item.rank}</th>
                                 <th>{item.grade}</th>
                                 <td className="col-span-2">{item.studentname?.toUpperCase()}</td>
                                 <td className="font-bold col-span-2">{item.campusname?.toUpperCase()}                              </td>
                                 <td>
                          {item.status !== 'awarded' ? (
                            <button
                              onClick={()=>markAwarded(item.id)}
                              className="p-2 rounded-lg gap-2 px-3 pr-4 text-white flex bg-gradient-to-r from-red-500 to-red-600"
                            >
                              Mark as Awarded
                            </button>
                          ) : (
                            <button
                              className="p-2 rounded-lg gap-2 px-3 pr-4 flex bg-gradient-to-r from-green-100 to-emerald-200"
                            >
                              Awarded
                            </button>
                          )}
                                 </td>
                               </tr>
                            ))}
                          </tbody>
                        </table>
      </div>
    </Modal>
  );
}

export default AwardCard;
