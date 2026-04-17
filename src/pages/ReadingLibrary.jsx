import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Filter, Settings, MoreHorizontal, Star, Plus } from 'lucide-react'

/**
 * Reading Library Page - Exact Match to Screenshot
 * Replicates the library interface from the provided screenshot
 */
const ReadingLibrary = () => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')

    // Book data matching Arabic/English mix from screenshot
    const books = [
        {
            id: 1,
            title: "صيد الخاطر",
            author: "ابن الجوزي",
            rating: 5,
            status: "Finished",
            format: "Digital"
        },
        {
            id: 2,
            title: "السلطان يحكم",
            author: "مصطفى محمود",
            rating: 5,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 3,
            title: "البيوت في الوطن",
            author: "أحمد الشقيري",
            rating: 5,
            status: "Finished",
            format: "Digital"
        },
        {
            id: 4,
            title: "عقيدة المسلم في عقوق الوالدين",
            author: "نجيب الكيلاني",
            rating: 5,
            status: "Finished",
            format: "Digital"
        },
        {
            id: 5,
            title: "أعجب الرحلات",
            author: "أنيس منصور",
            rating: 5,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 6,
            title: "مواقف حسيدة في المؤونة والصداقة",
            author: "أسياء نعيم منصورة",
            rating: 5,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 7,
            title: "النجاح لا يأتي بالصدفة",
            author: "بسم عريف بدر كامل",
            rating: 5,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 8,
            title: "العقدين من خلال المعاصرين الطموحين للأجيال والعلوم الحديثة",
            author: "Michael H. Hart",
            rating: 5,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 9,
            title: "بيئة الله",
            author: "مصطفى محمود",
            rating: 5,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 10,
            title: "سواء خير الله",
            author: "مصطفى محمود",
            rating: 5,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 11,
            title: "قراءة المستقبل",
            author: "مصطفى محمود",
            rating: 5,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 12,
            title: "المؤمن",
            author: "مصطفى محمود",
            rating: 5,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 13,
            title: "لكل ضيق",
            author: "مصطفى محمود",
            rating: 5,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 14,
            title: "الفقراء الصبيحة",
            author: "Yaakov Perelman",
            rating: 5,
            status: "Finished",
            format: "Digital"
        },
        {
            id: 15,
            title: "ورد أهل القانون",
            author: "مصطفى محمود",
            rating: 5,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 16,
            title: "حل أمشكلاتك بنفسك",
            author: "إبراهيم الفقي",
            rating: 5,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 17,
            title: "50 مشكلة حل",
            author: "مصطفى محمود",
            rating: 5,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 18,
            title: "Rich Dad, Poor Dad",
            author: "Robert T. Kiyosaki",
            rating: 4,
            status: "Finished",
            format: "Digital"
        },
        {
            id: 19,
            title: "الأعداد البديهية",
            author: "تميم من عبد المؤمن",
            rating: 5,
            status: "Finished",
            format: "Digital"
        },
        {
            id: 20,
            title: "مخاطم من الطبيعة",
            author: "نبيل فاروق",
            rating: 5,
            status: "Finished",
            format: "Digital"
        },
        {
            id: 21,
            title: "لماذا تأخر المسلمون وتقدم غيرهم",
            author: "Matthew McRaven",
            rating: 5,
            status: "Finished",
            format: "Digital"
        },
        {
            id: 22,
            title: "مخاطر حول الصجون",
            author: "Goodwomn Mahnez",
            rating: 5,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 23,
            title: "The Power of Habit: Why We Do What We Do In Life and Business",
            author: "Charles Duhigg",
            rating: 4,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 24,
            title: "همبا",
            author: "محمد صديق",
            rating: 4,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 25,
            title: "أبسط عبرة جاة",
            author: "محمد صديق",
            rating: 4,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 26,
            title: "جدد حياتك",
            author: "محمد الغزالي",
            rating: 4,
            status: "Finished",
            format: "Digital"
        },
        {
            id: 27,
            title: "أين الله",
            author: "أحمد بشار",
            rating: 4,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 28,
            title: "كمبار",
            author: "خالد سالمة",
            rating: 3,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 29,
            title: "البليتوس",
            author: "كيتو موسع",
            rating: 3,
            status: "Finished",
            format: "Digital"
        },
        {
            id: 30,
            title: "اكتشف شرع في التونس",
            author: "أحمد عبد الرحمن",
            rating: 3,
            status: "Finished",
            format: "Digital"
        },
        {
            id: 31,
            title: "الطبيل الطويل",
            author: "أحمد بشار",
            rating: 3,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 32,
            title: "ليس هدم الأنكار الطبائعية العملية للانسان",
            author: "Scott G. Littlefield",
            rating: 3,
            status: "Finished",
            format: "Digital"
        },
        {
            id: 33,
            title: "الاسترخاء النطبيقي العلمي لنيوتوتمكت حمد سهوين",
            author: "Gary William Guy",
            rating: 3,
            status: "Finished",
            format: "Digital"
        },
        {
            id: 34,
            title: "سيلانو",
            author: "كيتو موسع",
            rating: 2,
            status: "Finished",
            format: "Digital"
        },
        {
            id: 35,
            title: "ذكريات السجد",
            author: "كيتام مسطلطاني",
            rating: 2,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 36,
            title: "نضرات حالية",
            author: "يوثيق أبشع",
            rating: 1,
            status: "Finished",
            format: "Physical"
        },
        {
            id: 37,
            title: "The five people you meet in heaven",
            author: "Mitch albom",
            rating: 0,
            status: "Reading",
            format: "Physical"
        },
        {
            id: 38,
            title: "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
            author: "James Clear",
            rating: 0,
            status: "Ready to Start",
            format: "Digital"
        },
        {
            id: 39,
            title: "حديث السجد",
            author: "مصطفى محمود",
            rating: 0,
            status: "Reading",
            format: "Digital"
        }
    ]

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ))
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Finished': return 'text-green-600'
            case 'Reading': return 'text-blue-600'
            case 'Ready to Start': return 'text-orange-600'
            default: return 'text-gray-600'
        }
    }

    const getFormatColor = (format) => {
        return format === 'Digital' ? 'text-purple-600' : 'text-blue-600'
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                📚
                            </div>
                            <span className="font-medium text-gray-900">مكتبتي</span>
                            <span className="text-gray-500">📁 خاص</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">تم التحرير في 25 نوفمبر 2024</span>
                        <button className="px-3 py-1 bg-accent text-white rounded text-sm">مشاركة</button>
                        <button className="text-ink-muted">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Left Sidebar */}
                <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
                    <div className="p-4">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">مكتبتي</h2>

                        {/* Service Desk */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">الخدمات</h3>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-blue-600">
                                    📚 مكتبتي
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    🔍 أريد القراءة
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    📖 تحدي القراءة
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    ⭐ Goodreads
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">إجراءات سريعة</h3>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    📝 إضافة كتاب للمكتبة
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    💬 إضافة اقتباس
                                </div>
                            </div>
                        </div>

                        {/* Current Read */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">القراءة الحالية</h3>
                            <div className="text-sm text-gray-600">
                                the richest man in babylon
                            </div>
                        </div>

                        {/* Deep Work */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">عمل عميق</h3>
                            <div className="text-sm text-gray-600">
                                The five people you meet in heaven
                            </div>
                        </div>

                        {/* Rating System */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">نظام التقييم</h3>
                            <div className="space-y-1 text-xs text-gray-600">
                                <div>⭐⭐⭐⭐⭐ : أحببته</div>
                                <div>⭐⭐⭐⭐ : أعجبني</div>
                                <div>⭐⭐⭐ : جيد</div>
                                <div>⭐⭐ : صعب</div>
                                <div>⭐ : أبداً مرة أخرى</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white">
                    {/* Welcome Header */}
                    <div className="border-b border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Welcome to The Library</h1>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                    <span>📚 My Library</span>
                                    <span>📖 On the Bookshelf</span>
                                    <span>📊 Timeline</span>
                                    <span>+ 1 more...</span>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-accent text-white rounded">+ New</button>
                        </div>
                    </div>

                    {/* Books Table */}
                    <div className="p-4">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 py-3 px-2 bg-gray-50 text-sm font-medium text-gray-700 border-b">
                            <div className="col-span-4">Title</div>
                            <div className="col-span-2">Author</div>
                            <div className="col-span-2">Rating</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Format</div>
                        </div>

                        {/* Table Rows */}
                        <div className="space-y-1">
                            {books.map((book, index) => (
                                <div key={book.id} className={`grid grid-cols-12 gap-4 py-2 px-2 text-sm hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                    <div className="col-span-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center text-xs">📄</div>
                                            <span className="text-blue-600 hover:underline cursor-pointer">{book.title}</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-gray-700">{book.author}</div>
                                    <div className="col-span-2 flex items-center space-x-1">
                                        {renderStars(book.rating)}
                                    </div>
                                    <div className="col-span-2">
                                        <span className={`inline-flex items-center ${getStatusColor(book.status)}`}>
                                            <div className="w-2 h-2 bg-current rounded-full mr-2"></div>
                                            {book.status}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className={getFormatColor(book.format)}>{book.format}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Toolbar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center space-x-4">
                        <button className="text-ink-muted">💬</button>
                        <span className="text-sm text-gray-600">Quote</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center mr-2">MS</div>
                            Mohamed Shams
                        </div>
                        <button className="px-4 py-2 bg-accent text-white rounded text-sm">+ New</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReadingLibrary
