import { UseFormRegister, FieldErrors } from "react-hook-form"

type FormData = {
  name: string
  phone: string
  paymentType: "dp" | "full"
  policyAgreement: boolean
}

type Props = {
  register: UseFormRegister<FormData>
  errors: FieldErrors<FormData>
}

const PayerInfo = ({ register, errors }: Props) => {
  const handlePhoneInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Menghindari huruf
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="font-semibold text-lg text-center">Data Penyewa</h2>

      {/* Nama Penyewa */}
      <div className="flex flex-col">
        <label htmlFor="name" className="text-sm mb-1 font-medium">
          Nama Grup / Nama Penyewa
        </label>
        <input
          id="name"
          type="text"
          placeholder="Masukkan nama grup atau penyewa"
          className="w-full p-2 rounded-md border border-gray-300 focus:outline-none"
          {...register("name", { required: "Nama wajib diisi" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Nomor Telepon */}
      <div className="flex flex-col">
        <label htmlFor="phone" className="text-sm mb-1 font-medium">
          No. Telp
        </label>
        <input
          id="phone"
          maxLength={13}
          type="tel"
          placeholder="Masukkan No. Telpon"
          className="w-full p-2 rounded-md border border-gray-300 focus:outline-none"
          {...register("phone", {
            required: "Nomor telepon wajib diisi",
            pattern: {
              value: /^[0-9]+$/, // hanya angka yang diterima
              message: "Nomor telepon hanya boleh angka",
            },
          })}
          onKeyDown={handlePhoneInput} // Cegah input huruf
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>
    </div>
  );
};

export default PayerInfo;
