import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Copy, Check, Send, Sparkles } from 'lucide-react';

export const FooterContact: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const emailAddress = 'mhussainakhter@gmail.com';
  const phoneNumber = '8210739639';
  const formattedPhone = '+91 8210739639';
  const whatsappUrl = `https://wa.me/918210739639?text=${encodeURIComponent(
    'Assalamu Alaikum Hussain Akhter, I am using your Al-Quran Kareem app and would like to connect.'
  )}`;

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(phoneNumber);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-emerald-900/15 dark:border-emerald-800/30 bg-gradient-to-br from-white via-emerald-50/40 to-amber-50/30 dark:from-stone-950 dark:via-emerald-950/20 dark:to-stone-900 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto my-8 text-stone-900 dark:text-stone-100">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Creator Info */}
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="relative">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_j8biewj8biewj8bi_ae784cb6.png"
              alt="Hussain Akhter"
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600 dark:border-emerald-400 shadow-sm ring-4 ring-emerald-500/20"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-stone-950 rounded-full" />
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Direct Contact / براہِ راست رابطہ
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium">
                Developer
              </span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              Hussain Akhter (حسین اختر)
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-md">
              کسی بھی مشورے، سوال یا رائے کے لیے آپ مجھ سے براہِ راست رابطہ کر سکتے ہیں۔
            </p>
          </div>
        </div>

        {/* Contact Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          {/* Email Option */}
          <div className="flex items-center rounded-xl bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-850 shadow-2xs overflow-hidden">
            <a
              href={`mailto:${emailAddress}?subject=${encodeURIComponent('Feedback for Al-Quran Kareem App')}`}
              className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-emerald-950 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors flex-1"
              title="Send Direct Email"
            >
              <Mail className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <div className="text-left">
                <span className="text-[10px] text-stone-400 block leading-none">Email</span>
                <span className="font-mono text-xs">{emailAddress}</span>
              </div>
            </a>
            <button
              onClick={handleCopyEmail}
              className="p-2.5 border-l border-stone-200 dark:border-stone-800 text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              title="Copy Email Address"
            >
              {copiedEmail ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Phone / Mobile Option */}
          <div className="flex items-center rounded-xl bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-850 shadow-2xs overflow-hidden">
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-emerald-950 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors flex-1"
              title="Call Directly"
            >
              <Phone className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <div className="text-left">
                <span className="text-[10px] text-stone-400 block leading-none">Call / Mobile</span>
                <span className="font-mono text-xs font-bold">{phoneNumber}</span>
              </div>
            </a>
            <button
              onClick={handleCopyPhone}
              className="p-2.5 border-l border-stone-200 dark:border-stone-800 text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              title="Copy Mobile Number"
            >
              {copiedPhone ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* WhatsApp Direct Option */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-transform active:scale-95 shadow-xs whitespace-nowrap"
            title="Chat directly on WhatsApp"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>WhatsApp رابطہ</span>
          </a>
        </div>
      </div>
    </div>
  );
};
