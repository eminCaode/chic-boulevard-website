import { HiArrowUturnLeft, HiOutlineLockClosed } from "react-icons/hi2";
import { HiOutlineCube } from "react-icons/hi";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-black mt-12">
      {/* Üst Bilgi Satırı */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center px-25 py-12 bg-white text-sm  ">
        <div className="border-l border-gray-200 flex flex-col gap-2">
          <span className=""></span>
          <p className="font-normal text-md"> GÜVENLİ ÖDEME</p>
        </div>
        <div className=" border-l border-gray-200 flex flex-col gap-2">
          <span className=""></span>
          <p className="font-normal text-md"> KOLAY VE ÜCRETSİZ İADE</p>
        </div>
        <div className=" border-l border-gray-200 flex flex-col gap-2 ">
          <span className=""></span>
          <p className="font-normal text-md"> STANDART TESLİMAT</p>
        </div>
        <div className=" border-l border-r border-gray-200 flex flex-col gap-2 ">
          <span className=""></span>

          <p className="font-normal text-md"> TÜRKİYENİN HER YERİNE KARGO</p>
        </div>
      </div>

      {/* Orta Bilgi Alanı */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 px-8 py-12 text-sm bg-[#111]">
        {/* Hakkımızda */}
        <div>
          <h4 className="font-bold mb-4 text-white">HAKKIMIZDA</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Bize Ulaşın</li>
            <li>İnsan Kaynakları</li>
            <li>Üyelik Sözleşmesi</li>
            <li>KVKK</li>
          </ul>
        </div>

        {/* Hizmetler */}
        <div>
          <h4 className="font-bold mb-4 text-white">HİZMETLERİMİZ</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/account/profile">Hesabım</Link>
            </li>
            <li>İade Koşulları</li>
            <li>Sık Sorulan Sorular</li>
          </ul>
        </div>

        {/* Sipariş */}
        <div>
          <h4 className="font-bold mb-4 text-white">SİPARİŞ</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/account/orders">Siparişlerim</Link>
            </li>
            <li>Sipariş Takibi</li>
            <li>Ödeme Seçenekleri</li>
            <li>Kargo Bilgileri</li>
          </ul>
        </div>

        {/* Popüler */}
        <div>
          <h4 className="font-bold mb-4 text-white">POPÜLER KATEGORİ</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/men">Men</Link>
            </li>
            <li>
              <Link href="/women">Women</Link>
            </li>
            <li>
              <Link href="/accessories">Accessories</Link>
            </li>
          </ul>
        </div>

        {/* Müşteri Hizmetleri */}
        <div>
          <h4 className="font-bold mb-4 text-white">MÜŞTERİ HİZMETLERİ</h4>
          <p className="text-xl font-bold text-white">444 045 54</p>
          <p className="text-gray-400 text-sm mt-2">Hafta içi: 10.00 - 18.00</p>
        </div>
      </div>

      {/* Alt Çizgi ve Telif */}
      <div className="border-t border-gray-700 px-8 py-4 flex flex-col md:flex-row justify-between items-center text-xs bg-[#0d0d0d] text-gray-500">
        <p>© 2025 Chic-Boulevard. Tüm hakları saklıdır.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" aria-label="Instagram">
            <i className="fab fa-instagram text-lg hover:text-white"></i>
          </a>
          <a href="#" aria-label="Twitter">
            <i className="fab fa-twitter text-lg hover:text-white"></i>
          </a>
          <a href="#" aria-label="YouTube">
            <i className="fab fa-youtube text-lg hover:text-white"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
