export const scheduleService = {
    async getWeeklySchedule() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        { id: 1, groupName: "Frontend #8", teacher: "Javohir T.", room: "Xona-1 (IT)", day: "Dushanba", startTime: "14:00", endTime: "16:00", type: "PRACTICE" },
                        { id: 2, groupName: "IELTS 7.0+", teacher: "Malika A.", room: "Xona-2 (Ingliz tili)", day: "Dushanba", startTime: "16:30", endTime: "18:00", type: "THEORY" },
                        { id: 3, groupName: "Python #3", teacher: "Jasur R.", room: "Xona-3", day: "Chorshanba", startTime: "10:00", endTime: "12:00", type: "PRACTICE" },
                        { id: 4, groupName: "Backend Node", teacher: "Ali V.", room: "Xona-1 (IT)", day: "Juma", startTime: "14:00", endTime: "16:00", type: "PRACTICE" },
                        { id: 5, groupName: "SMM Pro", teacher: "Sardor S.", room: "Xona-2 (Ingliz tili)", day: "Payshanba", startTime: "18:00", endTime: "20:00", type: "THEORY" }
                    ]
                });
            }, 800);
        });
    }
};
