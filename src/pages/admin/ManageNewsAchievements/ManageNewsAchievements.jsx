import { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { StudentStoriesTable } from '../../../components/Tables/NewsAchievementTables/StudentStoriesTable';
import { Button } from 'primereact/button';
import { MilestonesTable } from '../../../components/Tables/NewsAchievementTables/MilestonesTable';
import { UpdatesTable } from '../../../components/Tables/NewsAchievementTables/UpdatesTable';
import AddNewsAchievements from '../../../components/Dialogs/AddNewsAchievements/AddNewsAchievements';
import axios from 'axios';
import { API_URL } from '../../../config';
import './ManageNewsAchievements.css';

const ManageNewsAchievements = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [data, setData] = useState({
        stories: [],
        milestones: [],
        updates: []
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/news/all`);

            const processedStories = response.data.studentStories.map(story => ({
                ...story,
                id: story._id,
                date: new Date(story.date)
            }));

            const processedMilestones = response.data.academicMilestones.map(milestone => ({
                ...milestone,
                id: milestone._id,
                createdAt: new Date(milestone.createdAt)
            }));

            const processedUpdates = response.data.recentUpdates.map(update => ({
                ...update,
                id: update._id,
                date: new Date(update.date),
                createdAt: new Date(update.createdAt)
            }));

            setData({
                stories: processedStories,
                milestones: processedMilestones,
                updates: processedUpdates
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="news-management">
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Student Stories">
                    <StudentStoriesTable
                        stories={data.stories}
                        loading={loading}
                        onRefetch={fetchData}
                    />
                </TabPanel>
                <TabPanel header="Academic Milestones">
                    <MilestonesTable
                        milestones={data.milestones}
                        loading={loading}
                        onRefetch={fetchData}
                    />
                </TabPanel>
                <TabPanel header="Recent Updates">
                    <UpdatesTable
                        updates={data.updates}
                        loading={loading}
                        onRefetch={fetchData}
                    />
                </TabPanel>
            </TabView>
            <AddNewsAchievements
                open={openAddDialog}
                onClose={() => {
                    setOpenAddDialog(false);
                    fetchData(); // Refresh data after adding
                }}
            />
            <div className="header-actions">
                <Button
                    label="Add New Content"
                    icon="pi pi-plus"
                    className="p-button-success"
                    onClick={() => setOpenAddDialog(true)}
                />
            </div>
        </div>
    );
};

export default ManageNewsAchievements;
