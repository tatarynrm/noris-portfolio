"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { MagneticButton } from "@/shared/ui/MagneticButton";

// Base schema just for TypeScript casting, the actual validation is inside the component scope
const baseSchema = z.object({
    name: z.string(),
    email: z.string(),
    interest: z.string(),
    dynamicField: z.string().optional(),
    projectDetails: z.string()
});

type FormValues = z.infer<typeof baseSchema>;

export function ContactForm() {
    const t = useTranslations("Contact");
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const formSchema = useMemo(() => {
        return z.object({
            name: z.string().min(2, t("name_error")),
            email: z.string().email(t("email_error")),
            interest: z.string().min(1, t("objective_error")),
            dynamicField: z.string().optional(),
            projectDetails: z.string().min(10, t("payload_error"))
        }).superRefine((data, ctx) => {
            if (data.interest && data.interest !== "Other" && (!data.dynamicField || data.dynamicField.trim().length === 0)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t("dynamic_error"),
                    path: ["dynamicField"]
                });
            }
        });
    }, [t]);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            interest: "",
            dynamicField: "",
            projectDetails: ""
        }
    });

    const selectedInterest = watch("interest");

    const triggerConfetti = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#3b82f6', '#10b981', '#ffffff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#3b82f6', '#10b981', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };

    const onSubmit = (data: FormValues) => {
        setIsSubmittingForm(true);

        // Fake submission delay simulating a network request
        setTimeout(() => {
            setIsSubmittingForm(false);
            setIsSuccess(true);
            triggerConfetti();
            reset();
        }, 2000);
    };

    const handleReset = () => {
        setIsSuccess(false);
    };

    const getDynamicFieldLabel = () => {
        switch (selectedInterest) {
            case "Web Application": return t("dynamic_web");
            case "Mobile App": return t("dynamic_mobile");
            case "Desktop App": return t("dynamic_desktop");
            case "Automation Bot": return t("dynamic_bot");
            default: return t("dynamic_default");
        }
    };

    // Animation Variants
    const errorShake = {
        initial: { x: 0 },
        error: { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } }
    };

    const errorMessageAnim = {
        initial: { opacity: 0, y: -10, height: 0 },
        animate: { opacity: 1, y: 0, height: "auto" },
        exit: { opacity: 0, y: -10, height: 0 }
    };

    return (
        <>
            <section id="contact" className="py-32 relative z-10 perspective-[2000px] overflow-hidden">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-white mb-6">
                            {t("title_1")} <span className="text-blue-500">{t("title_2")}</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
                            {t("subtitle")}
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="p-10 rounded-[3rem] backdrop-blur-2xl bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden"
                    >
                        {/* Inner ambient glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none -z-10" />

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 ml-2">{t("name_label")}</label>
                                    <motion.div animate={errors.name ? "error" : "initial"} variants={errorShake}>
                                        <input
                                            {...register("name")}
                                            className={`w-full px-6 py-4 bg-white/50 dark:bg-black/50 border rounded-2xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white placeholder-gray-400
                                                ${errors.name
                                                    ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                                    : 'border-gray-200 dark:border-white/10 focus:ring-blue-500/50 focus:border-blue-500'
                                                }`}
                                            placeholder={t("name_placeholder")}
                                        />
                                    </motion.div>
                                    <AnimatePresence>
                                        {errors.name && (
                                            <motion.div variants={errorMessageAnim} initial="initial" animate="animate" exit="exit" className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider ml-2 mt-1">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>{errors.name.message}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 ml-2">{t("email_label")}</label>
                                    <motion.div animate={errors.email ? "error" : "initial"} variants={errorShake}>
                                        <input
                                            {...register("email")}
                                            className={`w-full px-6 py-4 bg-white/50 dark:bg-black/50 border rounded-2xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white placeholder-gray-400
                                                ${errors.email
                                                    ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                                    : 'border-gray-200 dark:border-white/10 focus:ring-blue-500/50 focus:border-blue-500'
                                                }`}
                                            placeholder={t("email_placeholder")}
                                        />
                                    </motion.div>
                                    <AnimatePresence>
                                        {errors.email && (
                                            <motion.div variants={errorMessageAnim} initial="initial" animate="animate" exit="exit" className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider ml-2 mt-1">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>{errors.email.message}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 ml-2">{t("objective_label")}</label>
                                <motion.div animate={errors.interest ? "error" : "initial"} variants={errorShake}>
                                    <select
                                        {...register("interest")}
                                        className={`w-full px-6 py-4 bg-white/50 dark:bg-black/50 border rounded-2xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white appearance-none cursor-pointer
                                            ${errors.interest
                                                ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                                : 'border-gray-200 dark:border-white/10 focus:ring-blue-500/50 focus:border-blue-500'
                                            }`}
                                    >
                                        <option value="" disabled className="dark:bg-[#111]">{t("objective_placeholder")}</option>
                                        <option value="Web Application" className="dark:bg-[#111]">{t("obj_web")}</option>
                                        <option value="Mobile App" className="dark:bg-[#111]">{t("obj_mobile")}</option>
                                        <option value="Desktop App" className="dark:bg-[#111]">{t("obj_desktop")}</option>
                                        <option value="Automation Bot" className="dark:bg-[#111]">{t("obj_bot")}</option>
                                        <option value="Other" className="dark:bg-[#111]">{t("obj_other")}</option>
                                    </select>
                                </motion.div>
                                <AnimatePresence>
                                    {errors.interest && (
                                        <motion.div variants={errorMessageAnim} initial="initial" animate="animate" exit="exit" className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider ml-2 mt-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.interest.message}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <AnimatePresence mode="wait">
                                {selectedInterest && selectedInterest !== "" && (
                                    <motion.div
                                        key="dynamic-field"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-sm font-bold tracking-widest uppercase text-blue-500 ml-2">
                                            {getDynamicFieldLabel()}
                                        </label>
                                        <motion.div animate={errors.dynamicField ? "error" : "initial"} variants={errorShake}>
                                            <input
                                                {...register("dynamicField")}
                                                className={`w-full px-6 py-4 bg-blue-500/5 dark:bg-blue-500/10 border rounded-2xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white placeholder-blue-300 dark:placeholder-blue-800
                                                    ${errors.dynamicField
                                                        ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] text-red-500'
                                                        : 'border-blue-200 dark:border-blue-500/20 focus:ring-blue-500/50 focus:border-blue-500'
                                                    }`}
                                                placeholder="..."
                                            />
                                        </motion.div>
                                        <AnimatePresence>
                                            {errors.dynamicField && (
                                                <motion.div variants={errorMessageAnim} initial="initial" animate="animate" exit="exit" className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider ml-2 mt-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>{errors.dynamicField.message}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <label className="text-sm font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 ml-2">{t("payload_label")}</label>
                                <motion.div animate={errors.projectDetails ? "error" : "initial"} variants={errorShake}>
                                    <textarea
                                        {...register("projectDetails")}
                                        rows={5}
                                        className={`w-full px-6 py-4 bg-white/50 dark:bg-black/50 border rounded-2xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white placeholder-gray-400 resize-none
                                            ${errors.projectDetails
                                                ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                                : 'border-gray-200 dark:border-white/10 focus:ring-blue-500/50 focus:border-blue-500'
                                            }`}
                                        placeholder={t("payload_placeholder")}
                                    ></textarea>
                                </motion.div>
                                <AnimatePresence>
                                    {errors.projectDetails && (
                                        <motion.div variants={errorMessageAnim} initial="initial" animate="animate" exit="exit" className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider ml-2 mt-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.projectDetails.message}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex justify-center mt-6">
                                <MagneticButton strength={15} className="w-full">
                                    <button
                                        disabled={isSubmittingForm}
                                        type="submit"
                                        className="w-full group relative flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold tracking-widest uppercase overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                                    >
                                        {/* Button Hover Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors">
                                            {isSubmittingForm ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    {t("btn_sending")}
                                                </>
                                            ) : (
                                                <>
                                                    {t("btn_send")}
                                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </MagneticButton>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Black Full Screen Success Overlay */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                            className="bg-green-500/20 p-6 rounded-full border border-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.3)] mb-12"
                        >
                            <CheckCircle2 className="w-20 h-20 text-green-400" />
                        </motion.div>

                        <motion.h1
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 1, ease: "backOut" }}
                            className="text-4xl md:text-6xl lg:text-7xl font-black text-center text-white tracking-tighter leading-tight max-w-5xl"
                        >
                            {t("success_1")} <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                {t("success_2")}
                            </span>
                            <br className="hidden md:block" />
                            {t("success_3")}
                        </motion.h1>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2, duration: 1 }}
                            onClick={handleReset}
                            className="mt-16 px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all font-bold tracking-widest uppercase text-sm"
                        >
                            {t("return_btn")}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
