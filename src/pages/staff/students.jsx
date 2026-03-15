import { useEffect, useState } from "react"
import { studentService } from "../../api/student.service"
import { getArrayFromResponse } from "../../utils/normalizeResponse"
import { Trash2 } from "lucide-react"

export default function StudentsPage() {

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const data = await studentService.getStudents()
      setStudents(getArrayFromResponse(data))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const deleteStudent = async (id) => {
    if (!confirm("O'quvchini o'chirmoqchimisiz?")) return
    await studentService.deleteStudent(id)
    fetchStudents()
  }

  return (
    <div className="p-6">

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-bold">
          O'quvchilar
        </h1>

        <button className="px-4 py-2 rounded-lg bg-purple-600 text-white">
          Talaba qo'shish
        </button>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">№</th>
              <th className="p-3 text-left">FIO</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Tug'ilgan sana</th>
              <th className="p-3 text-left">Yaratilgan sana</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  Yuklanmoqda...
                </td>
              </tr>
            )}

            {!loading && students.map((s, i) => (
              <tr key={s.id} className="border-t">

                <td className="p-3">{i + 1}</td>

                <td className="p-3 flex items-center gap-3">

                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {s.fullName[0]}
                  </div>

                  {s.fullName}

                </td>

                <td className="p-3">
                  {s.email}
                </td>

                <td className="p-3">
                  {new Date(s.birth_date).toLocaleDateString()}
                </td>

                <td className="p-3">
                  {new Date(s.created_at).toLocaleDateString()}
                </td>

                <td className="p-3 text-right">

                  <button
                    onClick={() => deleteStudent(s.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={18}/>
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}