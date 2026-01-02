import React from 'react';
import { Shield, FileText, Users, Lock, AlertTriangle, CheckCircle, Building, Scale } from 'lucide-react';

export default function RBIComplianceGuidelines() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-purple-500/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-purple-600 mr-3" />
            <p className="text-2xl font-extrabold text-white">TrustBridge P2P Lending Platform - Regulatory Framework</p>
          </div>
          <p className="text-2xl text-gray-300">RBI Compliance Guidelines</p>
        </div>

        {/* Executive Summary */}
        <div className="bg-purple-900/30 rounded-lg p-6 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4 flex items-center">
            <Building className="h-6 w-6 mr-2" />
            Executive Summary
          </h2>
          <p className="text-gray-300 leading-relaxed">
            TrustBridge operates as a proof-of-concept P2P lending platform. To transition from MVP to production, 
            full compliance with Reserve Bank of India (RBI) regulations is mandatory. This document outlines 
            the comprehensive regulatory framework, current compliance status, and roadmap for full authorization.
          </p>
        </div>

        {/* RBI P2P Lending Framework */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-6 flex items-center">
            <Scale className="h-6 w-6 mr-2" />
            RBI P2P Lending Framework
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-gray-200 mb-3">NBFC-P2P License Requirements</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Minimum net owned fund of ₹2 crores</li>
                <li>• Registration as Non-Banking Financial Company</li>
                <li>• Platform facilitates lending only (no direct lending)</li>
                <li>• Maximum exposure: ₹50,000 per lender per borrower</li>
                <li>• Total exposure cap: ₹10 lakhs across all P2P platforms</li>
              </ul>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Operational Guidelines</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• No guarantee of returns to lenders</li>
                <li>• Risk assessment and disclosure mandatory</li>
                <li>• Transparent fee structure required</li>
                <li>• Regular reporting to RBI</li>
                <li>• Grievance redressal mechanism</li>
              </ul>
            </div>
          </div>
        </div>

        {/* KYC & Identity Verification */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-6 flex items-center">
            <Users className="h-6 w-6 mr-2" />
            KYC & Identity Verification
          </h2>
          
          <div className="bg-purple-900/30 rounded-lg p-6 mb-4 border border-purple-500/30">
            <h3 className="text-lg font-semibold text-purple-300 mb-3">Mandatory Requirements</h3>
            <div className="grid md:grid-cols-1 gap-4">
              <div className="text-center">
                <FileText className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <p className="font-medium text-purple-300">PAN Verification</p>
                <p className="text-sm text-purple-400">Income Tax Department API</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Additional Verification</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Digilocker integration for document verification</li>
              <li>• CKYC (Central KYC) registry compliance</li>
              <li>• Video KYC for remote onboarding</li>
              <li>• Periodic re-verification of customer data</li>
              <li>• AML (Anti-Money Laundering) screening</li>
            </ul>
          </div>
        </div>

        {/* Data Security & Consent */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-6 flex items-center">
            <Lock className="h-6 w-6 mr-2" />
            Data Security & Consent Management
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-900/30 rounded-lg p-6 border border-green-500/30">
              <h3 className="text-lg font-semibold text-green-300 mb-3">Data Protection</h3>
              <ul className="space-y-2 text-green-400">
                <li>• End-to-end encryption for all sensitive data</li>
                <li>• Secure data storage with access controls</li>
                <li>• Regular security audits and penetration testing</li>
                <li>• ISO 27001 compliance recommended</li>
                <li>• Data retention policies as per RBI guidelines</li>
              </ul>
            </div>
            
            <div className="bg-green-900/30 rounded-lg p-6 border border-green-500/30">
              <h3 className="text-lg font-semibold text-green-300 mb-3">Consent Management</h3>
              <ul className="space-y-2 text-green-400">
                <li>• Explicit consent for data collection</li>
                <li>• Purpose limitation and data minimization</li>
                <li>• Right to withdraw consent</li>
                <li>• Transparent privacy policy</li>
                <li>• Data sharing only with explicit consent</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Digital Lending Guidelines 2022 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">RBI Digital Lending Guidelines (2022)</h2>
          
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Critical Compliance Points
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-red-400 pl-4">
                <p className="font-medium text-red-800">Lending Service Provider (LSP) Restrictions</p>
                <p className="text-red-700 text-sm">No direct customer interaction by third-party LSPs without proper authorization</p>
              </div>
              <div className="border-l-4 border-red-400 pl-4">
                <p className="font-medium text-red-800">Data Localization</p>
                <p className="text-red-700 text-sm">All lending data must be stored within India's borders</p>
              </div>
              <div className="border-l-4 border-red-400 pl-4">
                <p className="font-medium text-red-800">Fair Practices</p>
                <p className="text-red-700 text-sm">Transparent pricing, no hidden charges, proper grievance redressal</p>
              </div>
              <div className="border-l-4 border-red-400 pl-4">
                <p className="font-medium text-red-800">Automated Decision Making</p>
                <p className="text-red-700 text-sm">AI/ML models must be explainable and auditable</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current MVP Status */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Current MVP Compliance Status</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Compliant Features
              </h3>
              <ul className="space-y-2 text-green-700">
                <li>✅ No real money transactions</li>
                <li>✅ Simulated lending environment</li>
                <li>✅ Document-based trust scoring</li>
                <li>✅ Encrypted data storage</li>
                <li>✅ User consent collection</li>
                <li>✅ Transparent fee disclosure</li>
              </ul>
            </div>
            
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Areas Requiring Development
              </h3>
              <ul className="space-y-2 text-red-700">
                <li>❌ NBFC-P2P license required</li>
                <li>❌ PAN API integration needed</li>
                <li>❌ Digilocker verification pending</li>
                <li>❌ CKYC compliance required</li>
                <li>❌ RBI reporting mechanisms</li>
                <li>❌ Formal grievance portal</li>
              </ul>
            </div>
          </div>
        </div>


        {/* Footer */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-2">
            <strong>Disclaimer:</strong> This document serves as a comprehensive guide for RBI compliance. 
            Legal consultation is recommended before implementing any production systems.
          </p>
          <p className="text-sm text-gray-500">
            Last Updated: July 2025 | Based on RBI Master Directions and Digital Lending Guidelines
          </p>
        </div>
      </div>
    </div>
  );
}