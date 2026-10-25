import React, { useState } from 'react';
import { InputNumber, Button, Form, Select, Spin, Row, Col, Typography, message, Divider, ConfigProvider, theme } from 'antd';
import { ThunderboltOutlined, CheckCircleFilled, CloseCircleFilled, StarFilled } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const MOCK_RESPONSE = {
  default_probability: 0.12,
  recommended_action: "approve",
  top_factors: [
    { feature: "debt_to_revenue", impact: 0.12, direction: "increases_risk" },
    { feature: "profit_margin", impact: -0.08, direction: "decreases_risk" },
  ],
  model_version: "v0.3 (Demo)"
};

const chartData = [
  { month: 'Мес 1', payment: 15000 },
  { month: 'Мес 2', payment: 15000 },
  { month: 'Мес 3', payment: 15000 },
  { month: 'Мес 4', payment: 15000 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const BackgroundThreads = () => {
  // Убрали синюю, добавили оранжевую (#ff7300)
  const threads = [
    { d: "M-100,200 C300,400 600,-100 1500,300", color: "#00ff66", delay: 0 },
    { d: "M-100,500 C400,200 800,600 1500,400", color: "#ff7300", delay: 2 }, // Оранжевая
    { d: "M-100,800 C300,1000 800,200 1500,700", color: "#ef3124", delay: 4 },
    { d: "M-100,100 C500,300 900,0 1500,200", color: "#00ff66", delay: 6 },
  ];

  return (
    <div className="threads-container">
      <svg viewBox="0 0 1440 900" fill="none" style={{ width: '100%', height: '100%' }}>
        {threads.map((thread, idx) => (
          <motion.path
            key={idx}
            d={thread.d}
            stroke={thread.color}
            className="thread-path"
            style={{ filter: 'blur(2px)' }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0, 0.4, 0] }}
            transition={{ duration: 15, repeat: Infinity, repeatDelay: 5 + thread.delay, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/credit/score', values);
      setResult(response.data);
    } catch (error) {
      message.warning("Бэкенд не отвечает. Показываю демо-результат.");
      setResult(MOCK_RESPONSE);
    } finally {
      setLoading(false);
    }
  };

  // СДЕСЬ ИЗМЕНЕН ЦВЕТ ПАНЕЛИ на темно-серо-зеленый
  const darkGlassPanelStyle = {
    background: 'rgba(20, 35, 25, 0.6)', // Был rgba(15, 23, 42, 0.6) — темно-синий. Стал зеленовато-серый.
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '40px',
    boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
    padding: '40px',
    height: '100%',
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#ef3124',
          colorText: '#ffffff',
          colorTextSecondary: '#94a3b8',
          colorBgContainer: 'rgba(30, 45, 35, 0.5)', // Поля ввода тоже сделали зеленоватыми
          colorBorder: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          fontFamily: "'Montserrat', sans-serif",
        },
      }}
    >
      <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        
        <div className="blob-container">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>

        <BackgroundThreads />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          
          <motion.div 
            variants={containerVariants} initial="hidden" animate="visible"
            style={{ padding: '100px 20px 40px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}
          >
            <motion.div variants={itemVariants}>
              <Text style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#ef3124', marginBottom: '24px', display: 'block' }}>
                Умный кредитный кабинет
              </Text>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Title style={{ fontSize: 'clamp(40px, 6vw, 72px)', color: '#ffffff', margin: 0, lineHeight: 1.1 }}>
                Устойчивый рост <br/>
                <span style={{ color: '#ef3124' }}>вашего бизнеса</span>
              </Title>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Paragraph style={{ fontSize: '18px', color: '#94a3b8', marginTop: '24px', maxWidth: '600px', margin: '24px auto 0', lineHeight: 1.6 }}>
                Оцените вероятность одобрения кредита на основе ИИ-модели. Быстро, прозрачно, без визитов в банк.
              </Paragraph>
            </motion.div>
          </motion.div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '20px 20px 100px', width: '100%' }}>
            <div style={{ 
              display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px',
              width: '100%', maxWidth: result || loading ? '1100px' : '650px', transition: 'max-width 0.5s ease-in-out'
            }}>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.8, delay: 0.8 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                style={{ flex: '1 1 100%', maxWidth: result || loading ? '500px' : '100%' }}
              >
                <div style={darkGlassPanelStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <StarFilled style={{ color: '#ef3124', fontSize: '20px' }} />
                    <Title level={3} style={{ margin: 0, color: '#fff' }}>Данные компании</Title>
                  </div>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '32px' }}>Заполните показатели</Text>
                  
                  <Form layout="vertical" onFinish={onFinish} initialValues={{ sector: 'retail' }} size="large">
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="business_age_months" label="Срок жизни (мес.)" rules={[{ required: true }]}>
                          <InputNumber style={{ width: '100%' }} placeholder="48" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="monthly_revenue_rub" label="Выручка (₽)" rules={[{ required: true }]}>
                          <InputNumber style={{ width: '100%' }} placeholder="600 000" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="current_debt_rub" label="Долг (₽)">
                          <InputNumber style={{ width: '100%' }} placeholder="350 000" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="profit_margin" label="Рентабельность">
                          <InputNumber style={{ width: '100%' }} step={0.01} placeholder="0.12" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="employees" label="Сотрудников">
                          <InputNumber style={{ width: '100%' }} placeholder="12" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="sector" label="Отрасль">
                          <Select>
                            <Option value="retail">Розница</Option>
                            <Option value="services">Услуги</Option>
                            <Option value="it">IT</Option>
                            <Option value="manufacturing">Производство</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Button 
                      type="primary" htmlType="submit" size="large" block loading={loading} icon={<ThunderboltOutlined />} 
                      style={{ 
                        height: '56px', fontSize: '18px', fontWeight: 700, marginTop: '16px', borderRadius: '16px',
                        background: 'linear-gradient(90deg, #ef3124 0%, #ff7300 100%)', border: 'none', color: '#fff',
                        boxShadow: '0 0 20px rgba(239, 49, 36, 0.4)'
                      }}
                    >
                      Оценить риски
                    </Button>
                  </Form>
                </div>
              </motion.div>

              {(loading || result) && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.6 }} 
                  whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                  style={{ flex: '1 1 100%', maxWidth: '500px' }}
                >
                  {loading ? (
                    <div style={{ ...darkGlassPanelStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                      <Spin size="large" />
                      <Title level={4} style={{ marginTop: '24px', color: '#fff' }}>Анализируем...</Title>
                    </div>
                  ) : (
                    <div style={darkGlassPanelStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        {result.recommended_action === 'approve' ? (
                          <CheckCircleFilled style={{ fontSize: '56px', color: '#00b96b' }} />
                        ) : (
                          <CloseCircleFilled style={{ fontSize: '56px', color: '#ff4d4f' }} />
                        )}
                        <div>
                          <Title level={3} style={{ margin: 0, color: '#fff' }}>{result.recommended_action === 'approve' ? 'Одобрено' : 'Отказ'}</Title>
                          <Text style={{ color: '#94a3b8' }}>Вероятность дефолта: <strong style={{ color: result.recommended_action === 'approve' ? '#00b96b' : '#ff4d4f' }}>{(result.default_probability * 100).toFixed(1)}%</strong></Text>
                        </div>
                      </div>
                      <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                      
                      <Title level={5} style={{ color: '#fff' }}>Ключевые факторы</Title>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        {result.top_factors.map((factor, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Text strong style={{ textTransform: 'capitalize', color: '#e2e8f0' }}>{factor.feature.replace(/_/g, ' ')}</Text>
                            <Text strong style={{ color: factor.direction === 'increases_risk' ? '#ef3124' : '#00b96b' }}>
                              {factor.direction === 'increases_risk' ? 'Риск ↑' : 'Риск ↓'}
                            </Text>
                          </div>
                        ))}
                      </div>
                      
                      <Title level={5} style={{ color: '#fff' }}>Прогноз платежей</Title>
                      <div style={{ height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `₽${val/1000}k`} />
                            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                            <Line type="monotone" dataKey="payment" stroke="#ef3124" strokeWidth={3} dot={{ r: 4, fill: '#ef3124' }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;