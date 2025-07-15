import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const colors = {
  white: '#fff',
  black: '#18181b',
  gray700: '#334155',
  gray600: '#475569',
  gray200: '#e5e7eb',
  blue: '#2563eb',
  blueLight: '#60a5fa',
  badgeBg: '#f1f5f9',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: 12,
    padding: 36,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    borderBottomStyle: 'solid',
    marginVertical: 12,
  },
  name: {
    fontSize: 30,
    fontWeight: 700,
    color: colors.black,
    marginBottom: 2,
    letterSpacing: 0.2,
    textAlign: 'left',
  },
  jobTitle: {
    fontSize: 16,
    color: colors.blue,
    fontWeight: 600,
    marginBottom: 14,
    textAlign: 'left',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
    textAlign: 'left',
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
    marginBottom: 2,
    fontSize: 12,
    color: colors.gray600,
    minWidth: 120,
  },
  icon: {
    width: 13,
    height: 13,
    marginRight: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: colors.blue,
    marginBottom: 8,
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    textAlign: 'left',
    letterSpacing: 0.1,
  },
  positionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
    gap: 8,
  },
  position: {
    fontWeight: 600,
    fontSize: 13,
    color: colors.black,
    textAlign: 'left',
  },
  company: {
    color: colors.blue,
    fontWeight: 500,
    fontSize: 12,
    marginBottom: 2,
    textAlign: 'left',
  },
  date: {
    fontSize: 11,
    color: colors.gray600,
    textAlign: 'right',
  },
  description: {
    color: colors.gray700,
    fontSize: 12,
    marginBottom: 2,
    lineHeight: 1.5,
    textAlign: 'left',
  },
  list: {
    marginLeft: 12,
    marginBottom: 2,
    color: colors.gray700,
    fontSize: 12,
    textAlign: 'left',
  },
  skillBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  skillBadge: {
    backgroundColor: colors.badgeBg,
    color: colors.black,
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 11,
    marginRight: 8,
    marginBottom: 6,
    fontWeight: 500,
    display: 'inline-block',
    textAlign: 'left',
  },
  gpa: {
    color: colors.gray700,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'left',
  },
  degree: {
    color: colors.blue,
    fontWeight: 600,
    fontSize: 13,
    textAlign: 'left',
  },
  institution: {
    color: colors.white,
    fontWeight: 500,
    fontSize: 12,
    marginBottom: 2,
    textAlign: 'left',
  },
});

const ResumePDF = ({ resumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.section}>
        <Text style={styles.name}>{resumeData?.personalInfo?.name || 'Your Name'}</Text>
        <Text style={styles.jobTitle}>{resumeData?.jobTitle || 'Professional Title'}</Text>
      </View>
      {/* Contact Info */}
      <View style={styles.contactRow}>
        {resumeData?.personalInfo?.email && (
          <View style={styles.contactItem}>
            <Image src="/icons/mail.png" style={styles.icon} />
            <Text wrap={false}>{resumeData.personalInfo.email}</Text>
          </View>
        )}
        {resumeData?.personalInfo?.phone && (
          <View style={styles.contactItem}>
            <Image src="/icons/phone.png" style={styles.icon} />
            <Text wrap={false}>{resumeData.personalInfo.phone}</Text>
          </View>
        )}
      </View>
      <View style={styles.contactRow}>
        {resumeData?.personalInfo?.location && (
          <View style={styles.contactItem}>
            <Image src="/icons/location.png" style={styles.icon} />
            <Text wrap={false}>{resumeData.personalInfo.location}</Text>
          </View>
        )}
        {resumeData?.personalInfo?.linkedin && (
          <View style={styles.contactItem}>
            <Image src="/icons/linkedin.png" style={styles.icon} />
            <Text wrap={false}>{resumeData.personalInfo.linkedin}</Text>
          </View>
        )}
        {resumeData?.personalInfo?.github && (
          <View style={styles.contactItem}>
            <Image src="/icons/github.png" style={styles.icon} />
            <Text wrap={false}>{resumeData.personalInfo.github}</Text>
          </View>
        )}
      </View>
      <View style={styles.divider} />
      {/* Professional Summary */}
      {resumeData?.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.description}>{resumeData.summary}</Text>
        </View>
      )}
      {/* Work Experience */}
      {resumeData?.experience?.length > 0 && resumeData.experience.some((e) => e.company) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {resumeData.experience.map(
            (exp, idx) =>
              exp.company && (
                <View key={exp.id || idx} style={{ marginBottom: 12 }}>
                  <View style={styles.positionRow}>
                    <Text style={styles.position}>{exp.position}</Text>
                    <Text style={styles.date}>{exp.startDate} - {exp.endDate || 'Present'}</Text>
                  </View>
                  <Text style={styles.company}>{exp.company}</Text>
                  {exp.description && <Text style={styles.description}>{exp.description}</Text>}
                </View>
              )
          )}
        </View>
      )}
      {/* Education */}
      {resumeData?.education?.length > 0 && resumeData.education.some((e) => e.institution) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {resumeData.education.map(
            (edu, idx) =>
              edu.institution && (
                <View key={edu.id || idx} style={{ marginBottom: 12 }}>
                  <View style={styles.positionRow}>
                    <Text style={styles.position}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text>
                    <Text style={styles.date}>{edu.startDate} - {edu.endDate || 'Present'}</Text>
                  </View>
                  <Text style={styles.company}>{edu.institution}</Text>
                  {edu.gpa && <Text style={styles.gpa}>GPA: {edu.gpa}</Text>}
                </View>
              )
          )}
        </View>
      )}
      {/* Skills */}
      {resumeData?.skills?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillBadgeRow}>
            {resumeData.skills.map((skill, idx) => (
              <Text key={idx} style={styles.skillBadge}>{skill}</Text>
            ))}
          </View>
        </View>
      )}
      {/* Achievements */}
      {resumeData?.achievements?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements & Awards</Text>
          {resumeData.achievements.map((ach, idx) => (
            <Text key={idx} style={styles.list}>• {ach}</Text>
          ))}
        </View>
      )}
      {/* Custom Sections */}
      {resumeData?.customSections && resumeData.customSections.length > 0 && resumeData.customSections.map(sec => (
        <View key={sec.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{sec.title}</Text>
          <Text style={styles.description}>{sec.content}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default ResumePDF;
